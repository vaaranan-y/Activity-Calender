var html = document.documentElement.outerHTML
open = false;
var itemCount = 0
const sideMenu = document.querySelector(".sidemenu");

sideMenu.addEventListener("click", () => {
	
	if (open){
		sideMenu.style.right = "-21vw"
		open = false;
	} else {
		sideMenu.style.right = "0px"
		open = true;
	}
})

var x = 0
var y = 0
var currentElement = 0;
toDrag = null
var copies = [];


const containers = document.querySelectorAll("div.p1 table tr td")
const draggables = document.querySelectorAll("div.sidemenu table tr td img")


function updateCopies(){
	var name = copies[copies.length - 1]
	console.log(copies[copies.length - 1])
	console.log(name)
	copies[copies.length - 1].addEventListener("touchstart", () => {
		//name.style.visibility = "hidden"
	})
	copies[copies.length - 1].addEventListener("touchmove", () => {
		x = event.touches[0].clientX;
		y = event.touches[0].clientY;
		document.body.append(name);
		name.style.position = "absolute";
		name.style.width = "250px";
		name.style.left = x+'px';
  		name.style.top = y+'px';
	})
	copies[copies.length - 1].addEventListener("touchend", () => {
		name.style.display = "none"
		console.log(document.elementFromPoint(x, y))
		console.log(document.elementFromPoint(x, y).classList.contains("deletion-box"))
		if (document.elementFromPoint(x, y).classList.contains("deletion-box")){
			name.remove();
			index = copies.indexOf(name)
			copies.splice(index, 1);
		} else {
			name.style.display = "block"
		}
	})

	console.log("yay")
}


for(let i = 0; i < 36; i++){
	draggables[i].addEventListener("touchstart", () => {
		currentElement = i;

		console.log(currentElement)
		toDrag = draggables[currentElement].cloneNode(true)
		toDrag.classList.add("copy");
		// toDrag.addEventListener("touchstart", console.log("working"))
		// draggables[currentElement].style.visibility = "hidden"
		
	})

}

for (item of draggables){
	item.addEventListener("touchmove", () => {
		x = event.touches[0].clientX;
		y = event.touches[0].clientY;
		console.log("dragging")
		document.body.append(toDrag);
		toDrag.style.position = "absolute";
		toDrag.style.width = "250px";
		toDrag.style.left = x+'px';
  		toDrag.style.top = y+'px';

	})
}

for (item of draggables){
	item.addEventListener("touchend", () => {
		
		// toDrag.remove();
		toDrag.style.display = "none"
		console.log(document.elementFromPoint(x, y).classList.contains("deletion-box"))
		if (document.elementFromPoint(x, y).classList.contains("deletion-box")){
			toDrag.remove();
		} else {
		itemCount += 1;
		
		toDrag.style.display = "block"
		copies.push(toDrag);
		updateCopies();
		localStorage.setItem("latest version", document.body.innerHTML);
		// localStorage.setItem("item" + itemCount, copies[copies.length - 1])
		// newContainer = document.elementFromPoint(x, y)
		// newContainer.append(draggables[currentElement])
		
		}
		
	})
}

var dateToday = new Date();
var day = dateToday.getDay() - 1;
const days = document.querySelectorAll("div.p1 table tr th");
if(day == -1){
	days[7].style.backgroundColor = "#c5e6f5" 
	for(var i = 6; i < 21; i += 7){
		containers[i].style.backgroundColor = "#c5e6f5" 
	}
	console.log(dateToday);
	console.log(day);
} else {
	days[day + 1].style.backgroundColor = "#c5e6f5" 
	for(var i = day; i < 21; i += 7){
		containers[i].style.backgroundColor = "#c5e6f5" 
	}
	console.log(dateToday);
	console.log(day);
}



console.log(html)

/**
 * SAVING DATA
 * 
 * to get latest version, recall localStorage.setItem("latest version", document.body.innerHTML);
 * therefore do the following
 * 1. var latestBody = localStorage.getItem("latest version")
 * 2. latestBody.split("</script>\n")
 * Now you have a string containing all the latest images
 * 3. Parse this string as so:
 * 		imagesToAdd = new DOMParser().parseFromString(latestBody[1]);
 * 4. Now the images are stored as elements in 'document.body.children'
 * 5.copies.push(doc.body.children[x]) where x goes from 0 to length of array
 * 6. updateCopies()
 * 7. document.body.append(copies.push(doc.body.children[x]);
 */		