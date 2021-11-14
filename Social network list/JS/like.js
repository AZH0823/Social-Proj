const baseURL = 'https://lighthouse-user-api.herokuapp.com'
const indexAPI = baseURL + '/api/v1/users/'
const peopleCard = document.querySelector("#peopleCards")

// const peopleAll = [] //存放API 所有人物資料
// let blackList = [] //存放黑名單
let favoroteList = JSON.parse(localStorage.getItem("favoroteFriend"))

const personalClick = document.querySelector("#person-Click")

const searchForm = document.querySelector("#search-form")
const searchBtn = document.querySelector("#search-btn")
const searchInput = document.querySelector("#search-Input")


function displayAllCards(data) {
  let tempData = ``
  for (let person of data) {
    tempData += `
    <div class="col-lg-3 bg-light m-3" style="max-width: 15rem">
      <div class="card d-flex" >
        <div class="card-header">
         <button type="button" class="close " data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" class="dislike-btn"  data-id="${person.id}">×</span>
            </button>
          ${person.name}
        </div>
        <div class="card-body align-self-center" >
          <img class="clickInfo" src="${person.avatar}" data-toggle="modal" data-target="#friend-Info" data-id="${person.id}" title="Show Personal Info">
        </div>
      </div>
    </div>
    `
  }
  peopleCard.innerHTML = tempData
}


searchInput.addEventListener("keyup", function keyup(event) {
  // console.log(event.code)
  if (!event.target.value.length || event.code === "Escape") {
    displayAllCards(favoroteList)
    return
  }
})
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
  fliterFriends = favoroteList.filter(friend => friend.name.toLowerCase().includes(keywords))
  // console.log(fliterFriends)
  if (!fliterFriends.length) {
    alert("Nothing Searching")
    searchInput.value = ""
  } else {
    displayAllCards(fliterFriends)
  }
})



peopleCard.addEventListener("click", function onPanelClicked(event) {
  // console.log(event.target)
  if (event.target.matches('.clickInfo')) {
    // console.log(event.target.dataset.id)
    displayPersonalInfo(Number(event.target.dataset.id))
  }
  if (event.target.matches('.dislike-btn')) {
    console.log(event.target.dataset.id)
    removeDislike(Number(event.target.dataset.id))
  }

})


function removeDislike(id) {
  // console.log("remove blackList list")
  const likeIndex = favoroteList.findIndex((friend) => friend.id === id)
  // console.log(movieIndex)

  favoroteList.splice(likeIndex, 1)
  localStorage.setItem("favoroteFriend", JSON.stringify(favoroteList))
  displayAllCards(favoroteList)

}
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

displayAllCards(favoroteList)