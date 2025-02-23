import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiZoomIn, FiZoomOut, FiMaximize, FiLayers, FiInfo } from 'react-icons/fi';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'your_mapbox_access_token';

export default function FraudHeatmap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(4);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [mapStyle, setMapStyle] = useState('light');

  // Mock fraud data for Indian states
  const fraudData = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {
          'state': 'Maharashtra',
          'intensity': 0.8,
          'cases': 245,
          'amount': '₹2.5 Cr',
          'topTypes': ['Document Forgery', 'Identity Theft']
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [73.8567, 18.5204]
        }
      },
      {
        'type': 'Feature',
        'properties': {
          'state': 'Delhi',
          'intensity': 0.75,
          'cases': 189,
          'amount': '₹1.8 Cr',
          'topTypes': ['Multiple Claims', 'Inflated Amount']
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [77.1025, 28.7041]
        }
      },
      // Add more state data points
    ]
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}-v11`,
      center: [78.9629, 20.5937], // Center of India
      zoom: zoom,
      minZoom: 3.5,
      maxZoom: 15,
      bounds: [
        [68.7, 8.4], // SW coordinates
        [97.25, 37.6] // NE coordinates
      ],
      maxBounds: [
        [68.7, 8.4], // SW coordinates
        [97.25, 37.6] // NE coordinates
      ]
    });

    map.current.on('load', () => {
      // Add heatmap layer
      map.current.addSource('fraud-data', {
        'type': 'geojson',
        'data': fraudData
      });

      // Add heatmap layer
      map.current.addLayer({
        'id': 'fraud-heat',
        'type': 'heatmap',
        'source': 'fraud-data',
        'paint': {
          // Increase weight based on number of cases
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'cases'],
            0, 0,
            300, 1
          ],
          // Increase intensity as zoom level increases
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          // Color gradient
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          // Adjust radius based on zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          // Opacity based on zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            9, 0.5
          ]
        }
      });

      // Add point layer
      map.current.addLayer({
        'id': 'fraud-points',
        'type': 'circle',
        'source': 'fraud-data',
        'paint': {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'cases'],
            0, 4,
            300, 12
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, '#3B82F6',
            0.5, '#F59E0B',
            1, '#EF4444'
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      });

      setLoading(false);

      // Create popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      // Show popup on hover
      map.current.on('mouseenter', 'fraud-points', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
        
        const coordinates = e.features[0].geometry.coordinates.slice();
        const {
          state,
          cases,
          amount,
          topTypes
        } = e.features[0].properties;
        
        const popupContent = `
          <div class="p-3">
            <h3 class="font-semibold text-gray-800">${state}</h3>
            <div class="mt-2 space-y-1">
              <p class="text-sm text-gray-600">
                Cases: <span class="font-medium text-gray-800">${cases}</span>
              </p>
              <p class="text-sm text-gray-600">
                Amount: <span class="font-medium text-gray-800">${amount}</span>
              </p>
              <div class="text-sm text-gray-600">
                Top Fraud Types:
                <ul class="mt-1 list-disc list-inside">
                  ${topTypes.map(type => `<li class="text-gray-800">${type}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;

        popup
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map.current);
      });

      map.current.on('mouseleave', 'fraud-points', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });

      // Update zoom state on zoom
      map.current.on('zoom', () => {
        setZoom(map.current.getZoom());
      });
    });

    return () => map.current?.remove();
  }, [mapStyle]);

  const handleZoomIn = () => {
    map.current.zoomIn();
  };

  const handleZoomOut = () => {
    map.current.zoomOut();
  };

  const handleReset = () => {
    map.current.flyTo({
      center: [78.9629, 20.5937],
      zoom: 4,
      essential: true
    });
  };

  const toggleMapStyle = () => {
    setMapStyle(current => current === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden border border-gray-200">
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="text-gray-600">Loading map data...</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600"
          title="Zoom in"
        >
          <FiZoomIn />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600"
          title="Zoom out"
        >
          <FiZoomOut />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600"
          title="Reset view"
        >
          <FiMaximize />
        </button>
        <button
          onClick={toggleMapStyle}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600"
          title="Toggle map style"
        >
          <FiLayers />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-3">
          <FiInfo className="text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-700">Fraud Intensity</h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-24 h-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded" />
            <div className="flex justify-between w-full text-xs text-gray-600">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Circle size indicates number of cases
          </div>
        </div>
      </div>
    </div>
  );
}