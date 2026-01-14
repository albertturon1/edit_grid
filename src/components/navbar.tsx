import { useNavigate, useRouter } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

type NavbarProps = {
  height: number;
};

export function Navbar({ height }: NavbarProps) {
  const navigate = useNavigate();
  const router = useRouter();

  function goToIndexPage() {
    if (router.state.location.pathname === "/") {
      router.history.go(0);
    } else {
      navigate({ to: "/" });
    }
  }

  return (
    <div
      className="fixed top-0 left-0 z-20 flex w-full items-center justify-between border-b border-border bg-background px-3 sm:px-5"
      style={{ height }}
    >
      <button type="button" onClick={goToIndexPage}>
        <Logo />
      </button>
    </div>
  );
}
