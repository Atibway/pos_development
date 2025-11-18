import { useState, useEffect } from 'react'
const Pagination = ({
  setPage,
  page,
  count,
  nextPage,
  previousPage,
  canNextPage,
  canPrevPage,
  searchPage,
  searchCount,
  setSearchCount,
}) => {
  const [hasMore, setHasMore] = useState(false)
  const [pages, setPages] = useState([])
  const [sCount, setSCount] = useState(searchCount ? searchCount : 20)

  useEffect(() => {
    if (count) {
      const _pages = []
      const divison = Math.floor(count / sCount)
      const remainder = count % sCount
      if (remainder > 0) {
        for (let i = 0; i < divison; i++) {
          _pages.push(i)
        }
        _pages.push(divison)
      } else {
        for (let i = 0; i < divison; i++) {
          _pages.push(i)
        }
      }
      setPages(_pages)
    }
  }, [count])

  useEffect(() => {
    if (page === pages[pages.length - 1]) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [page, hasMore])

  return (
    <div className="p-1 bg-white flex justify-between">
      <div className="flex text-primary text-sm">
        <button
          className={'py-1 px-3 border border-gray2 cursor-pointer'}
          // aria-disabled={page === 1}
          style={{
            cursor: page === 0 ? 'not-allowed' : 'pointer',
            color: page === 0 ? 'gray' : 'inherit',
          }}
          onClick={() => {
            if (page === 0) return
            previousPage()
          }}
          disabled={page === 0}
        >
          Prev
        </button>
        {pages.map((p, i) => {
          return (
            <button
              className={`py-1 px-3 border border-gray2 cursor-pointer hover:bg-gray-200`}
              key={i}
              onClick={() => {
                setPage(p)
              }}
              style={{
                cursor: page === p ? 'not-allowed' : 'pointer',
                color: page === p ? 'white' : 'inherit',
                backgroundColor:
                  page === p
                    ? 'rgb(25 50 150 / var(--tw-bg-opacity))'
                    : 'inherit',
              }}
            >
              {p + 1}
            </button>
          )
        })}
        <button
          className={`py-1 px-3 border border-gray2 cursor-pointer`}
          // aria-disabled={hasMore === false}
          onClick={() => {
            if (hasMore === false) return
            nextPage()
          }}
          style={{
            cursor: hasMore === false ? 'not-allowed' : 'pointer',
            color: hasMore === false ? 'gray' : 'inherit',
          }}
          disabled={hasMore === false}
        >
          Next
        </button>
      </div>
      <div className="flex text-primary ">
        <div onClick={(e) => {
          setSearchCount(30)
        }} className="mx-1 px-2 py-1 cursor-pointer border border-gray2">30</div>
        <div onClick={(e) => {
          setSearchCount(50)
        }} className="mx-1 px-2 py-1 cursor-pointer border border-gray2">50</div>
        <div onClick={(e) => {
          setSearchCount(70)
        }} className="mx-1 px-2 py-1 cursor-pointer border border-gray2">70</div>
        <div onClick={(e) => {
          setSearchCount(100)
        }} className="mx-1 px-2 py-1 cursor-pointer border border-gray2">100</div>
      </div>
    </div>
  )
}
export default Pagination
