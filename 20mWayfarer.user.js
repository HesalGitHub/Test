// ==UserScript==
// @id             iitc-plugin-zaprange@zaso
// @name           IITC plugin: 20-meters-range for Wayfarer
// @category       Layer
// @version        0.1.4.20170108.21732
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://static.iitc.me/build/release/plugins/zaprange.meta.js
// @downloadURL    https://static.iitc.me/build/release/plugins/zaprange.user.js
// @description    Shows the 20-meters-range of Portals.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'iitc';
plugin_info.dateTimeVersion = '20170108.21732';
plugin_info.pluginId = 'zaprange';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ///////////////////////////////////////////////////////

  // use own namespace for plugin
  window.plugin.zaprange = function() {};
  window.plugin.zaprange.zapLayers = {};
  window.plugin.zaprange.MIN_MAP_ZOOM = 17;

  window.plugin.zaprange.portalAdded = function(data) {
    data.portal.on('add', function() {
      window.plugin.zaprange.draw(this.options.guid, this.options.team);
    });

    data.portal.on('remove', function() {
      window.plugin.zaprange.remove(this.options.guid, this.options.team);
    });
  }

  window.plugin.zaprange.remove = function(guid, faction) {
    var previousLayer = window.plugin.zaprange.zapLayers[guid];

  }

    // customize the circles
  window.plugin.zaprange.draw = function(guid, faction) {
    var d = window.portals[guid];
      var coo = d._latlng;
      var latlng = new L.LatLng(coo.lat,coo.lng);
      var optCircle = {color:'white',opacity:0.9,fillColor:'white',fillOpacity:0.3,weight:1.5,clickable:false};
      var range = 20;
      var circle = new L.Circle(latlng, range, optCircle);
      circle.addTo(window.plugin.zaprange.zapCircleResHolderGroup);
      window.plugin.zaprange.zapLayers[guid] = circle;
  }

  window.plugin.zaprange.showOrHide = function() {
    if(map.getZoom() >= window.plugin.zaprange.MIN_MAP_ZOOM) {
      // show the layer
      if(!window.plugin.zaprange.zapLayerResHolderGroup.hasLayer(window.plugin.zaprange.zapCircleResHolderGroup)) {
        window.plugin.zaprange.zapLayerResHolderGroup.addLayer(window.plugin.zaprange.zapCircleResHolderGroup);
        $('.leaflet-control-layers-list span:contains("20meter range")').parent('label').removeClass('disabled').attr('title', '');
      }
    } else {
      // hide the layer
      if(window.plugin.zaprange.zapLayerResHolderGroup.hasLayer(window.plugin.zaprange.zapCircleResHolderGroup)) {
        window.plugin.zaprange.zapLayerResHolderGroup.removeLayer(window.plugin.zaprange.zapCircleResHolderGroup);
        $('.leaflet-control-layers-list span:contains("20meter range")').parent('label').addClass('disabled').attr('title', 'Zoom in to show those.');
      }
    }
  }

  var setup =  function() {
    // this layer is added to the layer chooser, to be toggled on/off
    window.plugin.zaprange.zapLayerResHolderGroup = new L.LayerGroup();

    // this layer is added into the above layer, and removed from it when we zoom out too far
    window.plugin.zaprange.zapCircleResHolderGroup = new L.LayerGroup();

    window.plugin.zaprange.zapLayerResHolderGroup.addLayer(window.plugin.zaprange.zapCircleResHolderGroup);

    window.addLayerGroup('20meter range', window.plugin.zaprange.zapLayerResHolderGroup, true);

    window.addHook('portalAdded', window.plugin.zaprange.portalAdded);

    map.on('zoomend', window.plugin.zaprange.showOrHide);

    window.plugin.zaprange.showOrHide();
  }

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


