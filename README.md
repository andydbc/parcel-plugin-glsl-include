# parcel-plugin-glsl-include

Import `.glsl`, `.frag`, and `.vert` files as strings with [parcel](https://github.com/parcel-bundler/parcel). Includes support for the `#include "<filename>"` preprocessor directive inside of glsl files.

I made this because parcel's included glsl plugin uses glslify which doesn't seem to have great support for WebGL 2 (at the time of writing).

### How to use
1. Type ```npm install parcel-plugin-glsl-include --save```
2. Run parcel normally (it detects this plugin from your packages.json), and use the syntax: `import fragmentShader from './fragment.frag';` inside you javascript files to include your shaders as text.


### Not at all contrived example
**add1.glsl**
```glsl
int add1(int a, int b) {
    return a + b;
}
```

**add2.glsl**
```glsl
#include "add1.glsl"

int add2(int a, int b, int c) {
    return add1(a, b) + c;
}
```

**fragment.frag**
```glsl
#version 300 es
#include "add2.glsl"
void main() {
  int test = add2(5, 5, 5);
}
```

**index.js**
```js
import fragmentShader from './fragment.frag';
console.log(fragmentShader);
```
**Output:**
```glsl
#version 300 es
int add1(int a, int b) {
    return a + b;
}

int add2(int a, int b, int c) {
    return add1(a, b) + c;
}

void main() {
  int test = add2(5, 5, 5);
}
```
