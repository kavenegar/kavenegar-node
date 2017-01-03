/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true*/
(function () {
  "use strict";
  /* 
      Taken (and modified) from
      http://james.padolsey.com/javascript/removing-comments-in-javascript/
      which is loosely based on the one found here:
      http://www.weanswer.it/blog/optimize-css-javascript-remove-comments-php/
  */
  function removeComments(str) {
      //str = ('__' + str + '__').split('');
      str = (""+(str||"")).split('');
      // TODO use switch / case or function map
      var mode = {
              singleQuote: false
            , doubleQuote: false
            , regex: false
            , blockComment: false
            , lineComment: false
            , condComp: false 
          }
        , i
        , j
        , backslashCount
        , isEscaped
        ;

      // \'
      // \\'
      // \\\'
      for (i = 0; i < str.length; i++) {
          j = i - 1;
          backslashCount = 0;
          isEscaped = false;

          while ('\\' === str[j]) {
            backslashCount += 1;
            j -= 1;
          }

          isEscaped = (backslashCount % 2);

          if (mode.regexBracket) {
              if (str[i] === ']' && !isEscaped) {
                mode.regexBracket = false;
                mode.regex = true;
              }
              continue;
          }

          if (mode.regex) {
              // consider /[/]\//g
              if (str[i] === '[' && !isEscaped) {
                mode.regexBracket = true;
                mode.regex = false;
                continue;
              }
              if (str[i] === '/' && !isEscaped) {
                  mode.regex = false;
              }
              continue;
          }
   
          if (mode.singleQuote) {
              if (str[i] === "'" && !isEscaped) {
                  mode.singleQuote = false;
              }
              continue;
          }
   
          if (mode.doubleQuote) {
              if (str[i] === '"' && !isEscaped) {
                  mode.doubleQuote = false;
              }
              continue;
          }
   
          if (mode.blockComment) {
              if (str[i] === '*' && str[i+1] === '/') {
                  str[i+1] = '';
                  mode.blockComment = false;
              }
              str[i] = '';
              continue;
          }
   
          if (mode.lineComment) {
              if (str[i+1] === '\n' || str[i+1] === '\r' || (i === str.length - 1)) {
                  mode.lineComment = false;
              }
              str[i] = '';
              continue;
          }
   
          if (mode.condComp) {
              if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
                  mode.condComp = false;
              }
              continue;
          }
   
          mode.doubleQuote = str[i] === '"';
          mode.singleQuote = str[i] === "'";
   
          if (str[i] === '/') {
   
              if (str[i+1] === '*' && str[i+2] === '@') {
                  mode.condComp = true;
                  continue;
              }
              if (str[i+1] === '*') {
                  str[i] = '';
                  mode.blockComment = true;
                  continue;
              }
              if (str[i+1] === '/') {
                  str[i] = '';
                  mode.lineComment = true;
                  continue;
              }
              mode.regex = true;
   
          }
   
      }
      return str.join('');//.slice(2, -2);
  }

  module.exports = removeComments;
}());
