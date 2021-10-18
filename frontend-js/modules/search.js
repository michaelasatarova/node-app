export default class Search {
  // 1select DOM elements
  constructor() {
    this.headerSearchIcon = document.querySelector(".header-search-icon")
    this.events()
  }
  //2events
    events(){
      this.headerSearchIccon("click", () => {
        e.preventDefault()
        this.openOverlay()
      })
    }
  //3methods
  openOverlay(){
    alert("Open overlay just run")
  }
}