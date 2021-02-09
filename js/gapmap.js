const settings = [
    { type: "Line", color: '#FF7F00', key: 'topGap', zIndex: 2, title: 'Committee Top Gaps', url: 'data/TopCommitteeGaps.js' },
    { type: "Line", color: '#563B68', key: 'HUBgap', zIndex: 1, title: 'HUB Major Gaps', url: 'data/HUBPriorityGapMapTriCity.js' },
    { type: "Point", color: '#563B68', key: 'adoptGap', zIndex: 3, title: 'Adopt-a-Gap Campaign', url: 'data/AdoptGapTriCity.js', icon:'img/adopt.png' }]

// Create variable to hold map element, give initial settings to map
var centerCoord = [49.254667, -122.825015]
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

map.attributionControl.addAttribution('<a href="https://bikehub.ca/tri-cities">Tri-Cities Committee</a>');
map.attributionControl.addAttribution('<a href="https://bikehub.ca/get-involved/ungapthemap/adopt-gap">HUB Cycling</a>');

//--------------- add layers ---------------
var layerGroup = new L.LayerGroup();
layerGroup.addTo(map);

lineWeight = 5
if (!L.Browser.mobile) {
    lineWeight = 6
}

// ---- HUB gaps
var HUBgapStyle = {
    "color": settings[1].color, // 'darkpurple'
    "weight": lineWeight,
    "opacity": 0.5
};
var HUBgapStyleHighlight = {
    "color": settings[1].color, // 'darkpurple'
    "weight": lineWeight+1,
    "opacity": 0.8
};

// functions to highligh lines on click
function highlightFeatureHUB(e) {
    var layer = e.target;

    layer.setStyle(HUBgapStyleHighlight);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlightHUB(e) {
    HUBgapLayer.resetStyle(e.target);
}

// add popup and highlight
function onEachFeatureHUB(feature, layer) {
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

    layer.on({
        mouseover: highlightFeatureHUB,
        mouseout: resetHighlightHUB,
    });
}

var HUBgapLayer = new L.geoJSON(HUBGapsJson, {
    onEachFeature: onEachFeatureHUB,
    style: HUBgapStyle
})
layerGroup.addLayer(HUBgapLayer);

// ----  HUB Adopt-a-gap campain markers
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
    style: HUBgapStyle,
    onEachFeature: onEachFeatureAdopt,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: adoptIcon
        });
    }
});
//adoptLayer.addTo(map);
layerGroup.addLayer(adoptLayer);

// ---- Committe Top gaps
// lines style
var topGapStyle = {
    "color": settings[0].color, // darkOrange_color ("Paired")
    "weight": lineWeight,
    "opacity": 0.5
};
var topGapStyleHighlight = {
    "color": settings[0].color, // 'darkpurple'
    "weight": lineWeight+1,
    "opacity": 0.8
};

function highlightFeatureTop(e) {
    var layer = e.target;

    layer.setStyle(topGapStyleHighlight);

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
        if (feature.properties.location) {
            popupContent += "<b>Location: </b>";
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
    style: topGapStyle,
    onEachFeature: onEachFeatureTop,
});
layerGroup.addLayer(topGapLayer);

// ---- legend 
function addLegend() {
    const legend = L.control({ position: 'topright' })
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div')
        let legendHtml = '<div id="legendbtn" class="fill-darken2 pad1 icon menu button fr" style="display: none"></div>' +
            '<div id="legend" class="fill-darken1 round" style="display: block">' +
            '<div id="closebtn" class="fill-darken2 pad1 icon close button fr"></div>' +
            '<div class="clearfix"></div>' +
            '<form><fieldset class="checkbox-pill clearfix">'

        for (let setting of settings) {
            legendHtml += addLegendLine(setting)
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

    var lineHtml = '<input type="checkbox" id="'+ setting.key +'" onclick="toggleLayer(this)" checked="checked">' +
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
        targetLayer = HUBgapLayer
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