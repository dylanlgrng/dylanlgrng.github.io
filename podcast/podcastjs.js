function recupLien() {
    var link;
    link = document.getElementById("lien");
    console.log("link = " + link.value);
    ouvrir(link, 1);
}

function recupFI1() {
    ouvrir("http://radiofrance-podcast.net/podcast09/rss_16370.xml", 0);
}

function recupFI2() {
    ouvrir("http://radiofrance-podcast.net/podcast09/rss_10504.xml", 0);
}

function recupFI3() {
    ouvrir("http://radiofrance-podcast.net/podcast09/rss_14089.xml", 0);
}

function recupFInter1() {
    ouvrir("http://radiofrance-podcast.net/podcast09/rss_13970.xml", 0);
}

function recupFInter2() {
    ouvrir("http://radiofrance-podcast.net/podcast09/rss_10241.xml", 0);
}

function recupFInter3() {
    ouvrir("http://radiofrance-podcast.net/podcast09/rss_14522.xml", 0);
}


function ouvrir(link, valueOK) {
    var div = document.getElementById("laDiv"); //pour montrer panel
    div.style.display = "block";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log("readystate = " + this.readyState);
        console.log("status = " + this.status);
        if (this.readyState === 4 && this.status === 200) {
            myFunction(this);
        }
    };
    if (valueOK === 1) { //parce que le link.value ne fonctionne qu'avec le getElement
        xhttp.open("GET", link.value, true);
        xhttp.send();
    } else if (valueOK === 0) {
        xhttp.open("GET", link, true);
        xhttp.send();
    }

}

function myFunction(xml) {
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("title");
    var y = xmlDoc.getElementsByTagName("description");
    var z = xmlDoc.getElementsByTagName("generator");
    var a = xmlDoc.getElementsByTagName("enclosure");
    var compt = 2;
    document.getElementById("titrePodcast").innerHTML = x[0].childNodes[0].nodeValue;
    document.getElementById("descriptionPodcast").innerHTML = y[0].childNodes[0].nodeValue;
    document.getElementById("nomradioPodcast").innerHTML = z[0].childNodes[0].nodeValue;

    do {
        var table = document.getElementById("panel");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = "<h6>" + x[compt].childNodes[0].nodeValue + "</h6> <p2>" + y[compt - 1].childNodes[0].nodeValue + "</p2>";
        cell2.innerHTML = "<BUTTON >LIRE >></BUTTON>";
        compt = compt + 1;
    } while (compt < x.length);

}
