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

function ouvrir(link, valueOK) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log("readystate = " + this.readyState);
        console.log("status = " + this.status);
        if (this.readyState === 4 && this.status === 200) {
            myFunction(this);
        }
    };
    if (valueOK === 1) { //parce que le link.value ne fonctionne qu'avec le get
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
    document.getElementById("titrePodcast").innerHTML = x[0].childNodes[0].nodeValue;
    document.getElementById("descriptionPodcast").innerHTML = y[0].childNodes[0].nodeValue;
    document.getElementById("nomradioPodcast").innerHTML = z[0].childNodes[0].nodeValue;

    var a, b, titreitem, c, d, descriptionitem;
    titreitem = "";
    descriptionitem = "";
    a = xmlDoc.getElementsByTagName("title");
    c = xmlDoc.getElementsByTagName("description");
    for (b = 2; b < a.length; b++) {
        titreitem += a[b].childNodes[0].nodeValue + "<br>";
    }
    document.getElementById("titreitem").innerHTML = titreitem;

    var c, d, descriptionitem;
    descriptionitem = "";
    c = xmlDoc.getElementsByTagName("description");
    for (d = 1; d < c.length; d++) {
        descriptionitem += c[d].childNodes[0].nodeValue + "<br>";
    }
    document.getElementById("descriptionitem").innerHTML = descriptionitem;
    

}
