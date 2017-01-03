find . -name one.js | while read F; do echo 'console.log("one");' > ${F}; done
find . -name two.js | while read F; do echo 'console.log("two");' > ${F}; done
