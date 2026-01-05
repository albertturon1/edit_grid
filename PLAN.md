# PLAN

## Cel Projektu

Transformacja istniejącego edytora CSV (React/Vite) w aplikację czasu rzeczywistego (Real-Time Collaborative Editor) przy użyciu architektury Serverless WebSocket. Projekt ma demonstrować zaawansowaną znajomość synchronizacji danych (CRDT), TypeScript po stronie klienta i serwera (Edge) oraz optymalizacji wydajności UI.

## Architektura Wysokopoziomowa

System opiera się na modelu **Client-Server-Client** z wykorzystaniem **PartyKit** (Cloudflare Workers) jako warstwy transportowej i **Yjs** jako silnika synchronizacji stanu.

- **Frontend (Vercel):** Odpowiada za rendering, obsługę zdarzeń użytkownika i wizualizację "Presence" (kursory).
- **Edge Backend (PartyKit):** Odpowiada za routing wiadomości WebSocket, przechowywanie tymczasowego stanu w pamięci (RAM) oraz trwałość danych (Persistence) w Cloudflare KV.
- **Shared Protocol:** Współdzielone definicje typów TypeScript między frontendem a backendem (Monorepo-like structure lub shared types package).

---

## Faza 1: Infrastruktura Real-Time i Synchronizacja Danych (MVP)

Głównym celem jest zastąpienie lokalnego stanu React (`useState`) stanem współdzielonym zarządzanym przez strukturę CRDT.

### 1.1. PartyKit Server Setup (Edge Layer)

- **Cel:** Uruchomienie lekkiego serwera WebSocket, który działa na brzegu sieci (Edge), minimalizując opóźnienia.
- **System Design:**
  - Utworzenie instancji `PartyServer` obsługującej logikę "pokoi" (Rooms). Każdy plik CSV to unikalny `roomId`.
  - Implementacja obsługi połączeń (`onConnect`, `onClose`).
  - Integracja `y-partykit/server` do obsługi protokołu synchronizacji binarnej Yjs.
  - **Technologie:** PartyKit, TypeScript, Cloudflare Workers (under the hood).

### 1.2. CRDT Data Model Implementation

- **Cel:** Zaprojektowanie schematu danych odpornego na konflikty edycji.
- **System Design:**
  - Migracja z tablicy obiektów JS na typy danych Yjs:
    - `Y.Array` jako główny kontener wierszy (dla zachowania kolejności).
    - `Y.Map` dla każdego wiersza (umożliwia edycję poszczególnych komórek bez nadpisywania całego wiersza).
    - `Y.Map` dla metadanych (nagłówki kolumn, nazwa pliku).
  - Implementacja mechanizmu "Initial Load": Pierwszy użytkownik parsuje CSV i inicjalizuje strukturę CRDT. Kolejni użytkownicy pobierają gotowy stan binarny.
- **Technologie:** Yjs, TypeScript (zdefiniowane interfejsy `Row` i `Cell`).

### 1.3. Integracja Frontendu (Hook-based Architecture)

- **Cel:** Podłączenie tabeli TanStack do strumienia danych Yjs bez utraty wydajności.
- **System Design:**
  - Stworzenie custom hooka `useCollaborativeTable(roomId)`, który:
    - Inicjalizuje `Y.Doc`.
    - Łączy się z `YPartyKitProvider`.
    - Subskrybuje zmiany w `Y.Array` i aktualizuje lokalny stan Reacta (re-render tylko przy zmianie danych).
  - Obsługa statusu połączenia (connecting, connected, disconnected) w UI.
- **Technologie:** React Hooks, y-partykit/provider.

---

## Faza 2: User Experience i "Awareness" (Efekt WOW)

Wprowadzenie wizualnych aspektów współpracy, aby użytkownicy widzieli swoje działania nawzajem.

### 2.1. Presence Protocol (Świadomość Obecności)

- **Cel:** Śledzenie, kto jest w pokoju i co robi, bez zapisywania tego w historii dokumentu.
- **System Design:**
  - Wykorzystanie modułu `Awareness` z Yjs (mechanizm ephemeral state – dane znikają po rozłączeniu).
  - Definicja typu `UserState`: `{ name: string, color: string, selectedCell: { rowId, colId } }`.
  - Propagacja pozycji kursora/selekcji w czasie rzeczywistym.
- **Technologie:** Yjs Awareness Protocol.

### 2.2. Collaborative UI Overlay

- **Cel:** Wizualizacja działań innych użytkowników na wirtualizowanej tabeli.
- **System Design:**
  - **Remote Cursors:** Renderowanie ramek wokół komórek edytowanych przez innych (mapowanie `rowId` -> DOM Element w wirtualnej liście).
  - **User List:** Komponent w navbarze pokazujący awatary (bąbelki) aktywnych użytkowników w czasie rzeczywistym.
  - Rozwiązanie problemu wirtualizacji: Renderowanie kursorów tylko dla widocznych wierszy (optymalizacja wydajności).
- **Technologie:** CSS Modules / Tailwind, TanStack Virtual (koordynacja z renderowaniem nakładek).

---

## Faza 3: Data Persistence i Analytics (Full-Stack Showcase)

Zapewnienie trwałości danych po zamknięciu kart przeglądarki i demonstracja analizy danych po stronie klienta.

### 3.1. Edge Persistence (Hibernation API)

- **Cel:** Zapobieganie utracie danych, gdy wszyscy użytkownicy opuszczą pokój.
- **System Design:**
  - Wykorzystanie storage API w PartyKit.
  - Implementacja logiki `onSave`: Zrzut binarny stanu `Y.Doc` do magazynu klucz-wartość (KV) w momencie, gdy pokój pustoszeje lub cyklicznie.
  - Przy ponownym otwarciu pokoju (`onRequest`), serwer ładuje stan z dysku do pamięci.
- **Technologie:** PartyKit Storage.

### 3.2. Client-Side Analytics Engine

- **Cel:** Pokazanie możliwości przetwarzania danych bez backendu analitycznego.
- **System Design:**
  - **Reactive Charts:** Komponent wykresów subskrybujący bezpośrednio zmiany w modelu Yjs (niezależnie od tabeli). Zmiana w komórce A1 natychmiast aktualizuje słupek na wykresie.
  - Automatyczne wykrywanie typów danych (np. wykrycie kolumny numerycznej do generowania wykresu).
- **Technologie:** Recharts lub Chart.js, React useMemo (do agregacji danych).

---

## Faza 4: Quality Assurance i Deployment (DevOps)

Profesjonalizacja projektu poprzez testy i CI/CD.

### 4.1. TypeScript Hardening & Shared Types

- **Cel:** Gwarancja spójności typów między klientem a serwerem.
- **System Design:**
  - Wydzielenie typów (Schemas) do osobnego pliku/modułu współdzielonego.
  - Ścisłe typowanie zdarzeń WebSocket (Message Passing).

### 4.2. Testing Strategy

- **Cel:** Weryfikacja poprawności synchronizacji (najtrudniejszy element).
- **System Design:**
  - **Unit Tests:** Testowanie logiki konwersji CSV <-> Yjs.
  - **Integration Tests (Simulated):** Uruchomienie dwóch instancji klienta Yjs w jednym teście i weryfikacja, czy zmiana w dokumencie A pojawia się w dokumencie B (in-memory simulation).
- **Technologie:** Vitest.

### 4.3. Final Deployment

- **Cel:** Publiczne udostępnienie aplikacji.
- **Akcje:**
  - Frontend: Push do `main` -> Auto-deploy na Vercel.
  - Backend: `npx partykit deploy` (deploy function to Edge Network).
  - Konfiguracja zmiennych środowiskowych (CORS policies).
