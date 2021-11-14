const baseURL = 'https://lighthouse-user-api.herokuapp.com'
const indexAPI = baseURL + '/api/v1/users/'
const peopleCard = document.querySelector("#peopleCards")

const peopleAll = [] //存放API 所有人物資料
let blackList = JSON.parse(localStorage.getItem("blackFriend")) || [] //存放黑名單
let fliterFriends = []

const personalClick = document.querySelector("#person-Click")

const searchForm = document.querySelector("#search-form")
const searchBtn = document.querySelector("#search-btn")
const searchInput = document.querySelector("#search-Input")

// 控制分頁的變數
const friend_PER_PAGE = 20
const pageAtor = document.querySelector('#paginator')

axios.get(indexAPI)
  .then(function (response) {

    // display in data all user
    // console.log(response.data)
    peopleAll.push(...response.data.results)

    displayAllCards(peopleAll)

    rederPagerAtor(peopleAll.length) //Footer 分頁顯示
    displayAllCards(getFriendByPage(1)) //只顯示第一頁


  })
// if (!(blackList.some((friend) => friend.id === person.id))) {

function displayAllCards(data) {
  // console.log("enter displayAllCards")
  if (!data) return
  peopleCard.innerHTML = ``
  let tempData = ``
  for (let person of data) {
    tempData += `
    <div class="col-lg-3 bg-light m-3" style="max-width: 15rem" data-id="${person.id}">
      <div class="card d-flex" >
        <div class="card-header">${person.name}</div>
        <div class="card-body align-self-center" >
          <img class="clickInfo" src="${person.avatar}" data-toggle="modal" data-target="#friend-Info" data-id="${person.id}" title="Show Personal Info">
        </div>
      </div>
    </div>
    `

  }

  peopleCard.innerHTML = tempData
}

function rederPagerAtor(amount) {
  // console.log("enter rederPagerAtor")
  let totalOfPage = Math.ceil(amount / friend_PER_PAGE)
  // console.log(totalOfPage)
  let rawHTML = ''
  for (let page = 1; page <= totalOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  pageAtor.innerHTML = rawHTML
  return totalOfPage
}
function getFriendByPage(page) {
  const data = fliterFriends.length ? fliterFriends : peopleAll
  const startIndex = (page - 1) * friend_PER_PAGE
  return data.slice(startIndex, startIndex + friend_PER_PAGE)
}

//page ator to Click 分頁器被點擊後
pageAtor.addEventListener('click', function onPageAtorClicked(event) {
  if (event.target.tagName !== "A") return
  // console.log(event.target.dataset)
  let page = Number(event.target.dataset.page)
  displayAllCards(getFriendByPage(page))
})


//點擊人物圖片 進入Modal Info
peopleCard.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches('.clickInfo')) {
    // console.log(event.target.dataset.id)
    displayPersonalInfo(event.target.dataset.id)
  }
})
// modal info 的元素框架撰寫
function displayPersonalInfo(id) {
  // console.log("show info: " + id)
  const titleName = document.querySelector("#person-Title")
  const img = document.querySelector("#person-img")
  const infoDetail = document.querySelector("#info-Detail")
  img.dataset.id = id
  axios.get(indexAPI + id)
    .then(function (response) {
      // display 1 data in user
      const personInfo = response.data
      // console.log(personInfo)
      titleName.innerHTML = `Personal Info - ${personInfo.name}`
      img.src = personInfo.avatar
      infoDetail.innerHTML = `name: ${personInfo.name} ${personInfo.surname}\nemail: ${personInfo.email}\ngender: ${personInfo.gender}\nage: ${personInfo.age}\nregion: ${personInfo.region}\nbirthday: ${personInfo.birthday}`
    })
}

//搜尋功能按滑鼠
searchForm.addEventListener("submit", function onSearchFormSubmited(event) {
  event.preventDefault()
  // console.log("enter in Search")
  // let fliterFriends = []
  let keywords = searchInput.value.trim().toLowerCase()
  if (!keywords.length) {
    alert("Please input U want Searching name")
  } else {
    console.log("search : " + keywords)
  }
  fliterFriends = peopleAll.filter(friend => friend.name.toLowerCase().includes(keywords))
  // console.log(fliterFriends)
  if (!fliterFriends.length) {
    alert("Nothing Searching")
    searchInput.value = ""
    displayAllCards(peopleAll)
    rederPagerAtor(peopleAll.length) //Footer 分頁顯示
    displayAllCards(getFriendByPage(1)) //只顯示第一頁
    fliterFriends = [] //清空搜尋結果
  } else {
    displayAllCards(fliterFriends)
    rederPagerAtor(fliterFriends.length) //Footer 分頁顯示
    displayAllCards(getFriendByPage(1)) //只顯示第一頁
    fliterFriends = [] //清空搜尋結果
  }
})
//搜尋功能使用鍵盤
searchInput.addEventListener("keyup", function keyup(event) {
  // console.log(event.code)
  if (event.target.value === null || event.target.value.length === 0) { //資料被清空的情況下
    console.log("enter")
    fliterFriends = [] //清空搜尋結果
    displayAllCards(peopleAll)
    console.log(peopleAll)
    console.log(peopleAll.length)
    rederPagerAtor(peopleAll.length) //Footer 分頁顯示
    displayAllCards(getFriendByPage(1)) //只顯示第一頁
    return
  }
})


personalClick.addEventListener('click', function addtoLike(event) {
  // console.log("enter add like or blacklist")

  //抓取 Modal Img 裡的 dataset id
  const id = document.querySelector('#person-img').dataset.id
  // const name = document.querySelector('#person-img').dataset.name
  if (event.target.matches('#like-btn')) {
    // console.log(id)
    alert('add to likelist !')
    addToFavorite(Number(id))
    return
  }
  if (event.target.matches('#dislike-btn')) {
    // console.log(event.target.dataset.id)
    alert('add to dislike !')
    addToblackList(Number(id))
    return
  }


})


//新增喜愛名單
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoroteFriend")) || []
  const friendLike = peopleAll.find((friend) => friend.id === id)

  if (list.some((friend) => friend.id === id)) {
    return
  }

  list.push(friendLike)
  localStorage.setItem("favoroteFriend", JSON.stringify(list))

}
//新增黑名單
function addToblackList(id) {
  // console.log("add To")
  const list = JSON.parse(localStorage.getItem("blackFriend")) || []
  const friendDisLike = peopleAll.find((friend) => friend.id === id)

  if (list.some((friend) => friend.id === id)) {
    return
  }

  list.push(friendDisLike)
  localStorage.setItem("blackFriend", JSON.stringify(list))

}


