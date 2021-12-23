import { Ticket } from "./ticket";
import { TicketStatus } from "./ticketStatus";

export type BoardColumn = {
    [key in TicketStatus]: {
        tickets: Ticket[]
    }
}