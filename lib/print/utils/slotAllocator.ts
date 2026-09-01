/**
 * Assigns photos to page slots in REVERSE SLOT ORDER per page (Bottom-to-Top print fill).
 * 
 * Physical Printer Rationale:
 * Printers feed paper from the bottom edge first. To ensure the first selected customer
 * photo is physically printed first, photos are assigned starting from the bottom-most slot
 * (index capacity - 1) upward toward top slots.
 * 
 * Multi-Page Behavior:
 * Reverse slot filling restarts on every page.
 */
export function buildReverseFilledSlots(
  assignedIds: readonly string[],
  capacity: number
): (string | null)[] {
  if (capacity <= 0) return [];

  const validIds = assignedIds.filter((id): id is string => Boolean(id) && id.trim().length > 0);
  if (validIds.length === 0) {
    return Array(capacity).fill(null);
  }

  const resultSlots: (string | null)[] = [];
  const totalPages = Math.ceil(validIds.length / capacity);

  for (let page = 0; page < totalPages; page++) {
    const pageIds = validIds.slice(page * capacity, (page + 1) * capacity);
    const pageSlots: (string | null)[] = Array(capacity).fill(null);

    pageIds.forEach((id, idx) => {
      const slotIndex = capacity - 1 - idx;
      pageSlots[slotIndex] = id;
    });

    resultSlots.push(...pageSlots);
  }

  return resultSlots;
}
