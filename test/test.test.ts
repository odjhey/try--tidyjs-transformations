import tap from 'tap'
import  { groupBy, mutate, sum, summarize, tidy } from '@tidyjs/tidy'

tap.test('new computed fields', (t) => {

  t.plan(1)

  const given = [
    {a: 1, b: 2},
    {a: 2, b: 9},
    {a: 5, b: 232},
  ]

  const expect = [
    {a: 1, b: 2, x: 3},
    {a: 2, b: 9, x: 11},
    {a: 5, b: 232, x: 237},
  ]


  const result = tidy(given, mutate({x: d => d.a + d.b}))

  t.same(result, expect)

})

tap.test('new grouped computed fields', (t) => {

  t.plan(1)

  const given = [
    {a: "g1", b: 2},
    {a: "g2", b: 9},
    {a: "g2", b: 232},
  ]

  const expect = [
    {a: "g1", total: 2},
    {a: "g2", total: 241},
  ]


  const result = tidy(given, groupBy('a', [
    summarize({total: sum('b')})
  ]))

  t.same(result, expect)


})
