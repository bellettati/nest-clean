import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
    compareItems(a: number, b: number) {
        return a === b
    }
}

describe('Watched List', () => {
    it('should create a watched list with initial items', () => {
        const list = new NumberWatchedList([1, 2, 3])

        expect(list.getItems()).toHaveLength(3)
    })

    it('should add new items to the list', () => {
        const list = new NumberWatchedList([1, 2, 3])

        list.add(4)

        expect(list.getItems()).toHaveLength(4)
        expect(list.getNewItems()).toEqual([4])
    })

    it('should be able to remove items from the list', () => {
        const list = new NumberWatchedList([1, 2, 3])

        list.remove(2)

        expect(list.getItems()).toHaveLength(2)
        expect(list.getRemovedItems()).toEqual([2])
    })

    it('should add an item even after removal', () => {
        const list = new NumberWatchedList([1, 2, 3])

        list.remove(2)
        list.add(2)

        expect(list.getItems()).toHaveLength(3)
        expect(list.getRemovedItems()).toEqual([])
        expect(list.getNewItems())
    })

    it('should update watched list items', () => {
        const list = new NumberWatchedList([1, 2, 3])

        list.update([1, 3, 4])

        expect(list.getItems()).toHaveLength(3)
        expect(list.getNewItems()).toEqual([4])
        expect(list.getRemovedItems()).toEqual([2])
    })
})
