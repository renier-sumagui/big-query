import { DateTime } from "luxon";

function getStoreDayRange(storeTimezone: string) {
    const now = DateTime.now().setZone(storeTimezone);
    const startOfDay = now.startOf('day').toSeconds(); // Unix timestamp in seconds
    const endOfDay = now.endOf('day').toSeconds();     // Unix timestamp in seconds
    return { startOfDay, endOfDay };
}

export { getStoreDayRange };