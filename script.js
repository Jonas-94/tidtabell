 const url = 'https://api.sl.se/api2/typeahead.json?key=031a025c261a488996e4d4a9871c540a&searchstring='; // söker efter en plats
 
 const url3 = 'https://api.sl.se/api2/realtimedeparturesV4.json?key=6a951083b01d429db09d03df89144494&siteid='; //Ankomst- och avgångsprognoser om bussar, tunnelbana, pendeltåg, lokalbana och båtar i Stockholm
 
 


// function för knapptrycket
 function buttonclick(){
    var home = document.getElementById("hem1").value; // skapar upp variabler för namnet på min busshållsplats occ den jag ska till
    var borta = document.getElementById("borta1").value;
    // if(borta == ""){borta = home} // ifall vi inte skriver en bortaadress så får jag upp allt i vår egen busshållsplats
   let newurl = url + home + "&stationsonly=true&maxresults=1"; // skapar api koden med rätt adress/ får ett alternativ av sökordet
   let newurl2 = url + borta + "&stationsonly=true&maxresults=1";
    
     // hämtar infon från min bussstation/ om apikoden funkar så returnar jag infon i json format
   fetch(newurl).then((resp) => {
        if(resp.ok){
            return resp.json();
        }
      // eftersom att fetchen är i en fetch får jag med den första json informationen
    }).then((data)=> { // gör samma sak med andra stationen 
    fetch(newurl2).then((resp) => {
            if(resp.ok){
                return resp.json();
            }
          
        }).then((data2)=> { // skickar siteid från första och andra stationen till getstationdata
            
            getstationdata(data.ResponseData[0].SiteId, data2.ResponseData[0].SiteId);
            return data2.ResponseData;
            
        
        })
        
        return data.ResponseData

        
    }) 

   
   setInterval(buttonclick, 60000); // knappen uppdateras en gång i minuten

 }

 function getstationdata(stationid1, stationid2){

   let url = url3 + stationid1; // skapar en url för att hämta info om alla inkommande transporter/
  fetch(url).then((resp) => {
    if(resp.ok){
        return resp.json();
    }
  
}).then((data) => {
    url = url3 + stationid2;
    fetch(url).then((resp) => {
     if(resp.ok){
         return resp.json();
     }
    }).then((data2) => {
        // sorterar ut alla transporter som inte går till  destination
        let buses = sortline(data.ResponseData.Buses,
         data2.ResponseData.Buses);
         let metros = sortline(data.ResponseData.Metros,
            data2.ResponseData.Metros);
            let trains = sortline(data.ResponseData.Trains,
                data2.ResponseData.Trains);
                

         // lägger in kvarvarande transpoter i olika ul
         visa(buses, "Buses")
        
         visa(metros, "Metros")
         
         visa(trains, "Trains")
         return data2;
    })
    return data; // returnenar fetcharna

})

  
 }

// tar två listor av transporter och returnerar elementen med samma journynumber
 function sortline(list1, list2){
     let newlist = [];
     for(i = 0; i <= list1.length -1; i++){ // jämför elementen i list1 med list2 och sparar dem med överlappande journynumber i newlist
         let jn1 = list1[i].JourneyNumber;
         for(j = 0; j <= list2.length -1; j++){
             let jn2 = list2[j].JourneyNumber;
            //  console.log(jn1 + "::" + jn2)
             if(jn1 == jn2){
                 newlist.push(list1[i]);


             }

         }
     }
     return newlist;

 }




  function visa(data, lable){

      
 
 var ul = document.getElementById(lable);
 let vt = document.getElementById("walktime").value;
  var listitem = document.createElement("li");

  
      ul.innerHTML = "";
  
  listitem.innerHTML = lable; // ger varje ul en titel
  ul.appendChild(listitem);
  for(i = 0; i <= data.length -1; i++){
      
      listitem = document.createElement("li");
      let timeoffset = (datetimediff(data[i].ExpectedDateTime ) -vt) // tiden för bussens ankomst minus min gång tid
      if(timeoffset >= 0){// ifall man hinner med bussen visar jag upp den  på sidan
      listitem.innerHTML = timeoffset + " mins : line " + data[i].LineNumber + "::" + data[i].Destination;
      ul.appendChild(listitem);
      }

  }
  
}
// tar tiden tills bussen går från min hållplats
function datetimediff(datetime){
    var date = new Date();
    
    var arrival = new Date();
     // lägger in all information om när transporten anländer till stationen i arrival
    arrival.setFullYear(parseInt(datetime.substring(0,4)))
     arrival.setMonth(parseInt(datetime.substring(5,7))-1) // månaderna började på noll istället för ett
     arrival.setDate(parseInt(datetime.substring(8,10)))
     arrival.setHours( parseInt(datetime.substring(11,13)))
     arrival.setMinutes(parseInt(datetime.substring(14,16)))
    arrival.setSeconds(parseInt(datetime.substring(18,20)))



     

      var diff = arrival - date;
      var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000)// gör skilnad från millisekunder till minuter
    
      return diffMins;




}

 
    
    



   



    
     
    
 
 

