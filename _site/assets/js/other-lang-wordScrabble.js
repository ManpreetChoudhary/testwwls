// grab some html elements

const getScript = document.currentScript
let form = document.querySelector('#form')
let wordCount = document.querySelector('.wordCount')
let main = document.querySelector('.main')
let errorMsg = document.querySelector('.errorMsg')
let script = document.currentScript

// getqueryUrl from form
const params = new URLSearchParams(window.location.search)
let serachValue = params.get('search').toLowerCase()
let prefixValue = params.get('prefix')
let containsValue = params.get('contains')
let suffixValue = params.get('suffix')
let exculdeValue = params.get('exculde')
let includeValue = params.get('include')
let lengthValue = params.get('length')

// advanced filter element grabs
let tick
let startsWith = document.getElementById('startsWith')
let mustInclude = document.getElementById('mustInclude')
let endsWith = document.getElementById('endsWith')
let exculdeWith = document.getElementById('exculdeWith')
let inculdeWith = document.getElementById('inculdeWith')
let wordLength = document.getElementById('wordLength')

let ok = true

let tab_container = document.querySelector('.tab_container')
const siteUrl = window.location.href;
const lang = script.dataset.language
var sortValue
var sortBool = false

let txtBox = document.querySelector('.txtBox')
txtBox.focus()
txtBox.value = serachValue

let letterCloseButton = document.querySelector('.letter-close-button-commonPage')
if (serachValue) {
  letterCloseButton.classList.add("ltr-cls-btn-commonPage")
  // letterCloseButton.style.right = "70px"
}
letterCloseButton.addEventListener("click", () => {
  txtBox.value = ""
  letterCloseButton.classList.remove("ltr-cls-btn-commonPage")
})


txtBox.addEventListener('input', (e) => {
  if (e.target.value === "") {
    letterCloseButton.classList.remove("ltr-cls-btn-commonPage")
  } else {
    letterCloseButton.classList.add("ltr-cls-btn-commonPage")
  }
})
var theSelect = document.getElementById('select_dropDown')
const select_dropDown2 = document.querySelector(".select_dropDown2")
select_dropDown2[0].style.display = "none"
select_dropDown2[1].style.display = "none"
select_dropDown2[2].style.display = "none"
select_dropDown2[3].style.display = "none"
const getDiff = (text1, text2) => {
  var diffRange = []
  var currentRange = undefined
  for (var i = 0; i < text1.length; i++) {
    if (text1[i] != text2[i]) {
      if (currentRange == undefined) {
        currentRange = [i]
      }
    }
    if (currentRange != undefined && text1[i] == text2[i]) {
      currentRange.push(i)
      diffRange.push(currentRange)
      currentRange = undefined
    }
  }
  if (currentRange != undefined) {
    currentRange.push(i)
    diffRange.push(currentRange)
  }
  return diffRange
}

// getWords define...
const getData = async (serachValue) => {
  try {
    main.innerHTML = `<div class="loader">
    <img src='/assets/images/loading.gif'>
    <div style="font-weight:900;font-size:14px" >Finding words - Powered by ${siteUrl.replace(/^https?:\/\//, '').split("/")[0]}</div>
    </div>`
    /// loader
    let response = null;
    if (lang == "french")
      response = await fetch(`/.netlify/functions/get-fr-words?name=${serachValue}`)
    if (lang == "german")
      response = await fetch(`/.netlify/functions/get-de-words?name=${serachValue}`)
    if (lang == "italian")
      response = await fetch(`/.netlify/functions/get-it-words?name=${serachValue}`)
    if (lang == "spanish")
      response = await fetch(`/.netlify/functions/get-es-words?name=${serachValue}`)
    const data = await response.json()
    main.innerHTML = ''
    getWords(data)
    //getWords calling...
  } catch (error) {
    console.log(error)
  }
}
//getData calling...
if (lengthValue === '1') {
  errorMsg.innerHTML = 'words length should be more than 1'
} else {
  getData(serachValue.toLowerCase())
}

// getWords function define...
function getWords(data) {
  if (typeof data === 'string') {
    errorMsg.innerHTML = 'no words found'
    wordCount.innerHTML = `<strong>Found 0 words with letters ${serachValue.split(
      ''
    )}</strong>`
  } else {
    let newWordsLength = 0

    // sort eventlistener
    theSelect[3].style.display = "none"
    theSelect.addEventListener('change', () => {
      sortValue = theSelect[theSelect.selectedIndex].text
      if (sortValue == 'Z-A') {
        sortBool = true
        sortby(sortBool, data)
      } else {
        sortBool = false
        sortby(sortBool, data)
      }
    })

    for (let i = serachValue.length; i >= 1; i--) {
      let newdata = data.filter((item) => item.length === i)

      if (prefixValue) {
        newdata = newdata.filter((item2) =>
          item2.startsWith(prefixValue.toLowerCase())
        )
        startsWith.classList.add('tick')
        startsWith.value = prefixValue
      }
      if (containsValue) {
        newdata = newdata.filter((item) =>
          item.includes(containsValue.toLowerCase())
        )
        mustInclude.classList.add('tick')
        mustInclude.value = containsValue
      }
      if (suffixValue) {
        newdata = newdata.filter((item) =>
          item.endsWith(suffixValue.toLowerCase())
        )
        endsWith.classList.add('tick')
        endsWith.value = suffixValue
      }

      if (exculdeValue) {
        let data = []
        newdata.map((item) => {
          let check = false
          for (let e = 0; e < exculdeValue.length; e++) {
            const element = exculdeValue[e]
            if (item.includes(element)) {
              check = true
              break
            } else {
              check = false
            }
          }
          if (check === false) {
            data.push(item)
          }
        })
        exculdeWith.classList.add('tick')
        exculdeWith.value = exculdeValue
        newdata = data
      }
      if (includeValue) {
        let data = []
        newdata.map((item) => {
          let check = false
          for (let e = 0; e < includeValue.length; e++) {
            const element = includeValue[e]
            if (!item.includes(element)) {
              check = true
              break
            } else {
              check = false
            }
          }
          if (check === false) {
            data.push(item)
          }
        })
        inculdeWith.classList.add('tick')
        inculdeWith.value = includeValue
        newdata = data
      }

      if (lengthValue) {
        newdata = newdata.filter((item) => item.length == lengthValue)
        wordLength.classList.add('tick')
        wordLength.value = lengthValue
      }

      if (newdata.length === 0) {
        main.innerHTML += ''
      } else {
        newWordsLength += newdata.length
        const result = newdata.map((item) => {
          var text1 = serachValue.replace('?', '')
          var text2 = item
          var text3 = item
          let chars = text1.split('')
          let indexs = []
          chars.map((i) => {
            let findIndexes = findIndex(text3, i)
            if (findIndexes.length > 0) {
              text3 = text3.split('')
              text3[findIndexes] = '$'
              text3 = text3.join('')
              indexs = [...indexs, ...findIndexes]
            }
          })
          let itemHtml = ''
          text2.split('').map((itemValue, index) => {
            let check = indexs.find((i) => i === index)
            if (check !== undefined) {
              itemHtml += `${itemValue}`
            } else {
              itemHtml += `<span class='highlight'>${itemValue}</span>`
            }
          })

          if (item.length === 1) {
            ok = false
            newWordsLength = newWordsLength - 1
          } else {
            return `<li><h4 style="font-weight:600">${item}</h4></li>`
          }
        })

        if (ok) {
          tab_container.innerHTML += `
          <input type="button" id="Tab_${i}" onclick="Filtering(${i})" value="${i} Letter"
          class="tab_link  cursorPointer" />
          `
          let tabs = document.getElementsByClassName('tab_link')
          tabs[0] ? tabs[0].classList.add('active-tab') : ''
          main.innerHTML += `
          <div class="allGroupWords wordlistContainer" id="alpha_${i}">
              <div class="wordListHeading">
                  <h3 class="lead">${i} Letter Words</h3>
              </div>
              <div class="wordList">
                  <ul class="ul list-unstyled">
                   ${result.join('')}
                  </ul>
              </div>
          </div>
          `
        }
      }
    }

    if (newWordsLength === 0) {
      errorMsg.innerHTML = 'no words found'
    } else {
      wordCount.innerHTML = `<strong>Found ${newWordsLength} words with letters with ${serachValue.split(
        ''
      )}</strong>`
    }
  }
}

// sort by aplhabets
function sortby(sortBool, data) {
  if (sortBool) {
    main.innerHTML = ''
    data.reverse()
    let newWordsLength = 0
    for (let i = serachValue.length; i >= 1; i--) {
      var newdata = data.filter((item) => item.length === i)

      if (newdata.length === 0) {
        main.innerHTML += ''
      } else {
        newWordsLength += newdata.length

        const result = newdata.map((item) => {
          var text1 = serachValue.replace('?', '')
          var text2 = item
          var text3 = item
          let chars = text1.split('')
          let indexs = []
          chars.map((i) => {
            let findIndexes = findIndex(text3, i)
            if (findIndexes.length > 0) {
              text3 = text3.split('')
              text3[findIndexes] = '$'
              text3 = text3.join('')
              indexs = [...indexs, ...findIndexes]
            }
          })
          let itemHtml = ''
          text2.split('').map((itemValue, index) => {
            let check = indexs.find((i) => i === index)
            if (check !== undefined) {
              itemHtml += `${itemValue}`
            } else {
              itemHtml += `<span class='highlight'>${itemValue}</span>`
            }
          })
          if (item.length === 1) {
            ok = false
            newWordsLength = newWordsLength - 1
          } else {
            return `<li><h4 style="font-weight:600">${item}</h4></li>`
          }
        })

        main.innerHTML += `
        <div class="allGroupWords wordlistContainer" id="alpha_${i}">
            <div class="wordListHeading">
                <h3 class="lead">${i} Letter Words</h3>
            </div>
            <div class="wordList">
                <ul class="ul list-unstyled">
                 ${result.join('')}
                </ul>
            </div>
        </div>
        `
      }
    }
  } else {
    main.innerHTML = ''
    data.sort()
    for (let i = serachValue.length; i >= 1; i--) {
      var newdata = data.filter((item) => item.length === i)
      if (newdata.length === 0) {
        main.innerHTML += ''
      } else {
        const result = newdata.map((item) => {
          var text1 = serachValue.replace('?', '')
          var text2 = item
          var text3 = item
          let chars = text1.split('')
          let indexs = []
          chars.map((i) => {
            let findIndexes = findIndex(text3, i)
            if (findIndexes.length > 0) {
              text3 = text3.split('')
              text3[findIndexes] = '$'
              text3 = text3.join('')
              indexs = [...indexs, ...findIndexes]
            }
          })
          let itemHtml = ''
          text2.split('').map((itemValue, index) => {
            let check = indexs.find((i) => i === index)
            if (check !== undefined) {
              itemHtml += `${itemValue}`
            } else {
              itemHtml += `<span class='highlight'>${itemValue}</span>`
            }
          })
          if (item.length === 1) {
            ok = false
            newWordsLength = newWordsLength - 1
          } else {
            return `<li><h4 style="font-weight:600">${item}</h4></li>`
          }
        })
        main.innerHTML += `
        <div class="allGroupWords wordlistContainer" id="alpha_${i}">
            <div class="wordListHeading">
                <h3 class="lead">${i} Letter Words</h3>
            </div>
            <div class="wordList">
                <ul class="ul list-unstyled">
                 ${result.join('')}
                </ul>
            </div>
        </div>
        `
      }
    }
  }
}

//Handling of filter counter in advanced filter
function addFilterCount() {
  let filter_val = document.getElementsByClassName('filter_val')
  let filter = document.querySelector('.filter_count')
  let filter_count = 0

  filter_val[0].value = prefixValue
  filter_val[1].value = containsValue
  filter_val[2].value = suffixValue
  filter_val[3].value = exculdeValue
  filter_val[4].value = includeValue
  filter_val[5].value = lengthValue

  for (var i = 0; i <= 4; i++) {
    if (filter_val[i].value != '') {
      filter_count += 1
    }
    if (filter_count === 0) {
      filter.style.display = 'none'
    } else {
      filter.style.display = 'inline-block'
    }

    filter.innerHTML = filter_count
  }
}
addFilterCount()


// handling of filter on scroll
window.onscroll = function () {
  var section = document.querySelectorAll('.wordlistContainer')
  let new_sections = {}
  Array.prototype.forEach.call(section, function (e) {
    if (document.body.clientWidth > 991) {
      new_sections[e.id] = e.offsetTop - 10
    } else {
      new_sections[e.id] = e.offsetTop - 10
    }
  })
  var scrollPosition =
    document.documentElement.scrollTop || document.body.scrollTop
  for (i in new_sections) {
    let sort_val = document.querySelector('.sort-select').value
    if (
      i.split('_')[0] == sort_val &&
      new_sections[i] &&
      new_sections[i] <= scrollPosition
    ) {
      document.querySelector('.active-tab').classList.remove('active-tab')
      var active_now = document.querySelector('#Tab_' + i.split('_')[1])
      active_now.classList.add('active-tab')
      // active_now.scrollIntoView()
    }
  }
}

// Add Filtering
let sections = {}
function Filtering(id) {
  let tabs = document.getElementsByClassName('tab_link')
  tabs[0] ? tabs[0].classList.add('active-tab') : ''

  Array.from(tabs).map((item) => {
    item.classList.remove('active-tab')
  })
  main.innerHTML += ``
  let activeLetter = event.target
  activeLetter.classList.add('active-tab')

  var section = document.querySelectorAll('.wordlistContainer')
  var sort_val = document.querySelector('.sort-select').value
  Array.prototype.forEach.call(section, function (e) {
    if (document.body.clientWidth > 991) {
      sections[e.id] = e.offsetTop - 10
    } else {
      sections[e.id] = e.offsetTop - 10
    }
  })

  document.body.scrollTop = sections[sort_val + '_' + id] + 5
}

// next && previous functionality
let prev = document.getElementById('prev')
let next = document.getElementById('next')

if (prev) {
  prev.onclick = scroll_Right
}
if (next) {
  next.onclick = scroll_Left
}
window.addEventListener('resize', function () {
  scroll_visible()
})
window.addEventListener('scroll', function () {
  scroll_visible()
})
function scroll_visible() {
  let tab_container = document.querySelector('#tab-container')

  if (tab_container) {
    if (tab_container.clientWidth === tab_container.scrollWidth) {
      prev.style.display = 'none'
      next.style.display = 'none'
    } else {
      prev.style.display = 'block'
      next.style.display = 'block'
    }
  }
}
scroll_visible()

function scroll_Left() {
  tab_container.scrollLeft += 130
}
function scroll_Right() {
  tab_container.scrollLeft -= 130
}
function findIndex(str, char) {
  const strLength = str.length
  const indexes = []
  let newStr = str

  while (newStr && newStr.indexOf(char) > -1) {
    indexes.push(newStr.indexOf(char) + strLength - newStr.length)
    newStr = newStr.substring(newStr.indexOf(char) + 1)
    newStr = newStr.substring(newStr.indexOf(char) + 1)
  }

  return indexes
}
