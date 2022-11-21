# Check performance of js Generators

This repo evaluates the perf of js generators against homegrown iterators and streams, using while loops and for/of/await syntax

```
homegrown iterator for of  x 398,907 ops/sec ±0.32% (95 runs sampled)
homegrown iterator while x 389,553 ops/sec ±1.08% (98 runs sampled)
js generator for of  x 55,049 ops/sec ±0.57% (95 runs sampled)
js generator while x 58,492 ops/sec ±0.44% (99 runs sampled)
Stream paused mode x 6,279 ops/sec ±5.86% (80 runs sampled)
Stream for await x 4,227 ops/sec ±0.52% (87 runs sampled)
async homegrown iterator for await  x 17,788 ops/sec ±0.85% (89 runs sampled)
async homegrown iterator while x 21,391 ops/sec ±0.36% (89 runs sampled)
async generator for await x 9,700 ops/sec ±0.30% (88 runs sampled)
async generator while x 10,443 ops/sec ±0.32% (92 runs sampled)
Fastest is homegrown iterator for of ,homegrown iterator while
```

## Usage

```
npm i 
node bench.js
```
