# Timeline Guide

## Basic sequence

```js
const tl = UAE.timeline();

tl.add('.title',    { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { duration: 500 })
  .add('.subtitle', { opacity: 0 },        { opacity: 1 },        { duration: 400 })
  .add('.cta',      { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, { duration: 300 })
  .play();
```

## Position values

| Value | Meaning |
|---|---|
| _(none)_ | Append after previous animation ends |
| `500` | Start at 500ms absolute |
| `'-=200'` | Overlap previous by 200ms |
| `'+=100'` | Add 100ms gap after previous |
| `'myLabel'` | Start at a named label |

```js
tl.add('.a', from, to, { duration: 500 })
  .add('.b', from, to, { duration: 400 }, '-=200')  // overlaps by 200ms
  .add('.c', from, to, { duration: 300 }, '+=100'); // 100ms gap
```

## Labels

```js
tl.add('.intro', from, to, { duration: 600 })
  .addLabel('main')
  .add('.content', from, to, { duration: 400 })
  .addLabel('outro')
  .add('.footer', from, to, { duration: 300 });

tl.seekToLabel('main');
```

## Stagger

```js
tl.stagger('.card', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { duration: 400 }, 80);
// Each .card starts 80ms after the previous one
```

## Playback

```js
tl.play()
tl.pause()
tl.resume()
tl.reverse()
tl.restart()
tl.seek(0.5)           // 50% through total duration
tl.seekToLabel('main')
tl.destroy()

tl.duration            // total duration in ms
tl.state               // 'idle' | 'running' | 'paused' | 'finished'
```

## Callbacks

```js
const tl = UAE.timeline({
  onComplete() { console.log('done'); },
  onUpdate(progress) { console.log(progress); },
});
```
