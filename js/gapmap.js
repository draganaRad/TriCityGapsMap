const settings = [
    { type: "Line", color: '#FF7F00', key: 'topGap', zIndex: 2, title: 'Top Gaps', url: 'data/TopCommitteeGaps.js', checked: true},
    { type: "Line", color: '#9031AA', key: 'HUBgap', zIndex: 1, title: 'Gaps/Hotspots', url: 'data/HUBGapMap_Feb2022.js', checked: showHUBgaps},
    { type: "Point", color: '#563B68', key: 'adoptGap', zIndex: 3, title: 'Adopt a Gap', url: 'data/AdoptGapTriCity.js', icon:'img/adopt.png', checked: showAdopt}]

// Create variable to hold map element, give initial settings to map
//var centerCoord = [49.254667, -122.825015]
var centerCoord = [49.266872, -122.799271]
if (L.Browser.mobile) {
    // increase tolerance for tapping (it was hard to tap on line exactly), zoom out a bit, and remove zoom control
    var myRenderer = L.canvas({ padding: 0.1, tolerance: 5 });
    var map = L.map("map", { center: centerCoord, zoom: 11, renderer: myRenderer, zoomControl: false });
} else {
    var map = L.map("map", { center: centerCoord, zoom: 12 });
}

// Add OpenStreetMap tile layer to map element
L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}
).addTo(map);

map.attributionControl.addAttribution('<a href="https://wiki.bikehub.ca/sites/committees/index.php?title=Tri-Cities_Committee_Wiki">Tri-Cities HUB</a>');
map.attributionControl.addAttribution('<a href="https://bikehub.ca/get-involved/ungapthemap">HUB Adopt Gap</a>');

//--------------- add layers ---------------
var layerGroup = new L.LayerGroup();
layerGroup.addTo(map);

lineWeight = 4
if (!L.Browser.mobile) {
    lineWeight = lineWeight + 1
}
lineOpacity = 0.55
lineOpacityHighlight = 0.8

// ALL GAPS =============================
// data source: https://www.google.com/maps/d/u/1/viewer?hl=en&mid=1wlQVVmwJBDBVMZt2S5-5Ts5z9unilKHJ&ll=49.262487040884245%2C-122.81604464401828&z=13
var HUBallGapStyle = {
    "color": '#9031AA',
    "weight": lineWeight,
    "opacity": lineOpacity
};
var HUBallGapStyleHighlight = {
    "color": '#9031AA',
    "weight": lineWeight+1,
    "opacity": lineOpacityHighlight
};

function highlightFeatureHUBall(e) {
    var layer = e.target;
    if (typeof layer.setStyle === "function") { //for markers received error here "layer.setStyle is not a function"
        layer.setStyle(HUBallGapStyleHighlight);
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
}
function resetHighlightHUBall(e) {
    if (typeof HUBallGapLayer.resetStyle === "function") {
        HUBallGapLayer.resetStyle(e.target);
    }
}

function onEachFeatureHUBall(feature, layer) {
    var popupContent = ""
    if (feature.properties) {
        if (feature.properties.Name) {
            popupContent += "<b>Location: </b>";
            popupContent += feature.properties.Name;
        }
        if (feature.properties.Description) {
            popupContent += "<br><b>Id: </b>";
            popupContent += feature.properties.Description;
        }
    }
    layer.bindPopup(popupContent);

    layer.on({
        mouseover: highlightFeatureHUBall,
        mouseout: resetHighlightHUBall,
    });
}

var HUBallIcon = L.icon({
    iconUrl: 'img/purplePinIcon2.png',
    iconSize: [22, 31],
    iconAnchor: [11, 30],
    popupAnchor:  [0, -20]
});

var HUBallGapLayer = new L.geoJSON(HUBGapsJson2022, {
    style: HUBallGapStyle,
    onEachFeature: onEachFeatureHUBall,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: HUBallIcon
        });
    }
});
if (showHUBgaps){
    layerGroup.addLayer(HUBallGapLayer);
}

// Adopt-a-gap campain markers =======================
function onEachFeatureAdopt(feature, layer) {
    var popupContent = ""
    if (feature.properties) {
        if (feature.properties.Name) {
            popupContent += "<b>Name: </b>";
            popupContent += feature.properties.Name;
        }
        if (feature.properties.Description) {
            popupContent += "<br><b>Description: </b>";
            popupContent += feature.properties.Description;
        }
    }
    layer.bindPopup(popupContent);
}

var adoptIcon = L.icon({
    iconUrl: 'img/adopt.png',
    iconSize: [25, 25], // size of the icon
});

var adoptLayer = new L.geoJSON(adoptGapsJson, {
    onEachFeature: onEachFeatureAdopt,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: adoptIcon
        });
    }
});
//adoptLayer.addTo(map);
if (settings[2].checked){
    layerGroup.addLayer(adoptLayer);
}

// Committe Top gaps =======================================================
// data source: https://wiki.bikehub.ca/sites/committees/index.php?title=Tri-Cities_Committee_Wiki

// style for lines
function styleTop(feature) {
    // for straight line make wider, more transparent and rounded corners
    var weight = lineWeight;
    var opacity = lineOpacity;
    if (feature.properties.type == "line"){
        weight = lineWeight + 13;
        opacity = 0.3
    }
    return {
        weight: weight,
        opacity: opacity,
        color: settings[0].color
    };
}

// functions to highlight lines on click
function highlightFeatureTop(e) {
    var layer = e.target;
    var newOpacity = lineOpacityHighlight;
    var newWeight = lineWeight+1;
    if (layer.feature.properties.type == "line"){
        newOpacity = 0.5
        newWeight = lineWeight + 14;
    }
    layer.setStyle({opacity :newOpacity, weight: newWeight});
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlightTop(e) {
    topGapLayer.resetStyle(e.target);
}

// add popup and highlight
function onEachFeatureTop(feature, layer) {
    var popupContent = ""
    if (feature.properties) {
        if (feature.id) {
            popupContent += "<b>Gap #";
            popupContent += feature.id + "</b>";
        }
        if (feature.properties.location) {
            popupContent += "<br><b>Location: </b>";
            popupContent += feature.properties.location;
        }
        if (feature.properties.description) {
            popupContent += "<br><b>Description: </b>";
            popupContent += feature.properties.description;
        }
    }
    layer.bindPopup(popupContent);

    layer.on({
        mouseover: highlightFeatureTop,
        mouseout: resetHighlightTop,
    });
}

var topGapLayer = new L.geoJSON(topCommitteeJson, {
    style: styleTop,
    onEachFeature: onEachFeatureTop,
});
layerGroup.addLayer(topGapLayer);

// ======================= LEGEND 
function addLegend() {
    const legend = L.control({ position: 'topright' })
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div')
        let legendHtml = '<div id="legendbtn" class="fill-darken2 pad1 icon menu button fr" style="display: none"></div>' +
            '<div id="legend" class="fill-darken1 round" style="display: block">' +
            '<div id="closebtn" class="fill-darken2 pad1 icon close button fr"></div>' +
            '<div class="clearfix"></div>' +
            '<form><fieldset class="checkbox-pill clearfix">'

        legendHtml += '<div class="button quiet col12">HUB Tri-Cities Cycling Gaps:</div>'

        for (let setting of settings) {
            legendHtml += addLegendLine(setting)
            // add "community feedback:"
            if (setting.key == "HUBgap"){ //todo: this probably shouldn't be hardcoded
                legendHtml += '<div class="button quiet col12">Community Feedback:</div>'
            }
        }
        // '<input type="checkbox" id="low_stress" checked="checked">' +
        // '<label for="low_stress" id="low_stress-label" class="button icon check quiet col12">' +
        // '&nbsp;<span style="display: inline-block;width:50px; height:8px;background-color:#377EB8"></span>&nbsp;Committee Top Gaps</label>' +

        // '<input type="checkbox" id="high_stress" checked="checked">' +
        // '<label for="high_stress" id="high_stress-label" class="button icon check quiet col12">' +
        // '&nbsp;<span style="display: inline-block;width:50px; height:8px;background-color:#377EB8"></span>&nbsp;HUB Major Gaps</label>' +

        // '<input type="checkbox" id="adopt_gap" checked="checked">' +
        // '<label for="adopt_gap" id="adopt_gap-label" class="button icon check quiet col12">' +
        // '&nbsp;' +
        // '<span style="display: inline-block;"><div style="display:flex; justify-content:center; align-items:center;"><img style="width:20px; height:20px;" src="img/adopt.png"></img>&nbsp;Adopt-a-Gap Campaign</div></span>' +
        // '</label>' +

        legendHtml += '<div class="button quiet col12">Click on map item for more info</div>'

        legendHtml += '</fieldset></form></div>'
        div.innerHTML = legendHtml

        // disable map zoom when double clicking anywhere on legend (checkboxes included)
        div.addEventListener('mouseover', function () { map.doubleClickZoom.disable(); });
        div.addEventListener('mouseout', function () { map.doubleClickZoom.enable(); });
        return div
    }
    legend.addTo(map)
}

function addLegendLine(setting) {
    var spanHtml
    if (setting.type == "Line"){
        spanHtml = '<span style="display:inline-block; width:50px; height:8px; background-color:' + setting.color +'"></span>' +
        '&nbsp;' + setting.title
    }
    if (setting.type == "Point"){
        spanHtml = '<span style="display: inline-block;"><div style="display:flex; justify-content:center; align-items:center;">' + 
        '<img style="width:20px; height:20px;" src="'+ setting.icon +'"></img>&nbsp;'+ setting.title +'</div></span>'
    }

    checkedHtml = ""
    if (setting.checked){
        checkedHtml = 'checked'
    }
    var lineHtml = '<input type="checkbox" id="'+ setting.key +'" onclick="toggleLayer(this)" ' + checkedHtml + ' >' +
        '<label for="'+ setting.key +'" id="'+ setting.key +'-label" class="button icon check quiet col12">' +
        '&nbsp;' + spanHtml + ' </label>'

    return lineHtml
}

addLegend()

// show hide legend
document.getElementById('legendbtn').onclick = function () { toggleDisplay(['legendbtn', 'legend']) };
document.getElementById('closebtn').onclick = function () { toggleDisplay(['legendbtn', 'legend']) };

function toggleDisplay(elementIds) {
    elementIds.forEach(function (elementId) {
        var x = document.getElementById(elementId);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    });
}

function toggleLayer(checkbox) {
    if (checkbox.id == "topGap"){
        targetLayer = topGapLayer
    }
    if (checkbox.id == "HUBgap"){
        targetLayer = HUBallGapLayer
    }
    if (checkbox.id == "adoptGap"){
        targetLayer = adoptLayer
    }

    if (checkbox.checked){
        layerGroup.addLayer(targetLayer);
    }else{
        layerGroup.removeLayer(targetLayer); 
    }
}