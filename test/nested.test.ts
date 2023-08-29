import tap from 'tap'
import  { groupBy, mutate, sum, summarize, tidy } from '@tidyjs/tidy'

tap.test('nested source', (t) => {

  t.plan(2)

  // TODO: add UOM
  const given = [
    {h: {key: 'k1'}, items: [
      {itemId: "1", value: 1239},
      {itemId: "2", value: 39}
    ]},
    {h: {key: 'k2'}, items: [
      {itemId: "1", value: 1},
      {itemId: "2", value: 39}
    ]},
    {h: {key: 'k2'}, items: [
      {itemId: "1", value: 19},
      {itemId: "2", value: 39},
      {itemId: "2", value: 2}
    ]}
  ]

  const expect1 = [
    {h: "k1", total: 1278},
    {h: "k2", total: 100},
  ]

  // how do we do this grouped -> flat in tidyjs?
  const int1 = given.flatMap(gh => gh.items.map(gi => ({h: gh.h.key, itemId: gi.itemId, value: gi.value})))

  const result = tidy(int1, groupBy('h', [
    summarize({total: sum('value')})
  ]))

  t.same(result, expect1)

  const expect2 = [
    {h: "k1", itemId: "1", total: 1239},
    {h: "k1", itemId: "2", total: 39},
    {h: "k2", itemId: "1", total: 20},
    {h: "k2", itemId: "2", total: 80},
  ]

  const result2 = tidy(int1, groupBy(["h", "itemId"], [
    summarize({total: sum('value')})
  ]))

  t.same(result2, expect2)

})
