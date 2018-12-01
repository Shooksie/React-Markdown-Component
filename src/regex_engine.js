
export default class RegexEngine {
  constructor(patterns, paramTag) {
    /* regexPatterns is an array of pattern objects that contain the regex pattern and what to the pattern with */
    this.regexPatterns = [];

    this.paramTag = (paramTag)? paramTag : 'p';
    if (patterns) {
      this.setRegexPatterns(patterns)
    }
  }

  setRegexPatterns(patterns) {
    /* regexPattern Setter */
    this.regexPatterns = patterns
  }

  getRegexPatterns() {
    return this.regexPatterns;
  }
  parse(toParse) {
    let tempvalue = toParse;
    this.regexPatterns.forEach((patternObj) => {
      tempvalue = this.regexReplace(patternObj, tempvalue);
    });
    return tempvalue;
  }

  regexReplace(patternObj, toParse) {
    // console.log(toParse);
    const { paramTag } = this;
    return toParse.replace(patternObj.pattern, (match, ...args) => {
      if (patternObj.params === 1) {
         return patternObj.with.replace(new RegExp(`{${paramTag}0}`,'g'), args[0])
      }else if(patternObj.special) {
        return patternObj.special(match, ...args)
      } else {
        let obj = patternObj.with;
        console.log(patternObj);
        console.log(args);
        for (let x=0; x < patternObj.params; x++) {
          const regexexp = new RegExp(`{${paramTag}${x}}`,'g');
          obj = obj.replace(regexexp, args[x])
        }
         return obj;
      }
    })
  }
}

