const Benchmark = require('benchmark');
const stream = require('stream');

const suite = new Benchmark.Suite();

const testArray = Array(1000)
  .fill(0)
  .map(() => Math.random() * 10);

class ArrayIterator {
  array;
  idx = 0;
  constructor(array) {
    this.array = array;
  }
  [Symbol.iterator]() {
    this.idx = 0;
    return this;
  }

  next() {
    const value = this.array[this.idx++];
    return {
      value,
      done: typeof value === 'undefined',
    };
  }
}

function* gen(array) {
  let idx = 0;
  let i;
  while((i = array[idx++])){
    yield i;
  }
  return;
}

class AsyncArrayIterator {
  array;
  idx = 0;
  constructor(array) {
    this.array = array;
  }
  [Symbol.asyncIterator]() {
    this.idx = 0;
    return this;
  }

  async next() {
    const value = this.array[this.idx++];
    return {
      value,
      done: typeof value === 'undefined',
    };
  }
}

async function* asyncGen(array) {
  let idx = 0;
  let i;
  while((i = array[idx++])){
    yield i;
  }
  return;
}

// add tests
suite
  .add('homegrown iterator for of ', () => {
    const it = new ArrayIterator(testArray);
    let sum = 0;
    for (const num of it) {
      sum += num;
    }
  })
  .add('homegrown iterator while', () => {
    const it = new ArrayIterator(testArray);
    let sum = 0;
    let { value, done } =  it.next();
    while (!done) {
      sum += value;
      (({ value, done } =  it.next()));
    }
  })
  .add('js generator for of ', () => {
    let sum = 0;
    const st = gen(testArray);
    for (const num of st) {
      sum += num;
    }
  })
  .add('js generator while', () => {
    let sum = 0;
    const st = gen(testArray);
    let { value, done } =  st.next();
    while (!done) {
      sum += value;
      (({ value, done } =  st.next()));
    }
  })
  .add('Stream paused mode', {
    fn: (d) => {
      const st = stream.Readable.from(testArray, { objectMode: true });
      let sum = 0;
      st.pause();
      let i;
      while ((i = st.read())) {
        sum += i;
      }
    },
  })
  .add('Stream for await', {
    defer: true,
    fn: async (d) => {
      const st = stream.Readable.from(testArray, { objectMode: true });
      let sum = 0;
      for await (const e of st) {
        sum += e;
      }
      d.resolve();
    },
  })
  .add('async homegrown iterator for await ', {
    defer: true,
    fn: async (d) => {
      const st = new AsyncArrayIterator(testArray);
      let sum = 0;
      for await (const e of st) {
        sum += e;
      }
      d.resolve();
    },
  })
  .add('async homegrown iterator while', {
    defer: true,
    fn: async (d) => {
      const st = new AsyncArrayIterator(testArray);
      let sum = 0;
      let { value, done } = await st.next();
      while (!done) {
        sum += value;
        (({ value, done } = await st.next()));
      }

      d.resolve();
    },
  })
  .add('async generator for await', {
    defer: true,
    fn: async (d) => {
      const st = asyncGen(testArray);
      let sum = 0;
      for await (const i of st) {
        sum += i
      }

      d.resolve();
    },
  })
  .add('async generator while', {
    defer: true,
    fn: async (d) => {
      const st = asyncGen(testArray);
      let sum = 0;
      let { value, done } = await st.next();
      while (!done) {
        sum += value;
        (({ value, done } = await st.next()));
      }

      d.resolve();
    },
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ async: true });
