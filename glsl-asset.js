const { Asset } = require('parcel-bundler');
const fs = require('fs');
const path = require('path');
const { exception } = require('console');

module.exports = class GLSLAsset extends Asset {

  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  replaceIncludes(text, depth = 0) {
    if(depth > 50) {
      throw "parcel-plugin-glsl failed to compile due to circular dependency";
    }

    let dirname = path.dirname(this.name);
    let regex = /^\s*#include\s"(.*)"\s*$/gm;
    var ref = this;
    let result = text.replace(regex, function(match, fileStr) {
      let file = path.resolve(dirname, fileStr);
      ref.addDependency(file, {includedInParent: true});
      let includedText = fs.readFileSync(file, "utf8");
      return ref.replaceIncludes(includedText, depth + 1);
    });
    return result + "\n";
  }

  generate() {
    // this.invalidate();
    let text = this.contents;

    text = this.replaceIncludes(text)

    return { js: `module.exports = \`${ text }\`` };
  }

};