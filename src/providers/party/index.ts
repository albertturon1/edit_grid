import type { PartyKitServer } from "partykit/server";
import { onConnect } from "y-partykit";

const server: PartyKitServer = {
	async onConnect(ws, room) {
		await onConnect(ws, room, {
			// Persist document state between sessions using PartyKit storage
			// "snapshot" mode stores latest state when all clients disconnect
			persist: { mode: "snapshot" },
		});
	},
};

export default server;
