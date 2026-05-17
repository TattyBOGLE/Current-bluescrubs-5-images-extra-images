import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface UserLocation {
  id: number;
  username: string;
  country: string;
  city: string;
  flagEmoji: string;
  latitude: number;
  longitude: number;
  totalScore: number;
  accuracyRate: number;
}

// Major city coordinates for user locations
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "London": { lat: 51.5074, lng: -0.1278 },
  "Manchester": { lat: 53.4808, lng: -2.2426 },
  "Edinburgh": { lat: 55.9533, lng: -3.1883 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "New Delhi": { lat: 28.6139, lng: 77.2090 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Karachi": { lat: 24.8607, lng: 67.0011 },
  "Lahore": { lat: 31.5804, lng: 74.3587 },
  "Islamabad": { lat: 33.7294, lng: 73.0931 },
  "Dhaka": { lat: 23.8103, lng: 90.4125 },
  "Chittagong": { lat: 22.3569, lng: 91.7832 },
  "Lagos": { lat: 6.5244, lng: 3.3792 },
  "Abuja": { lat: 9.0765, lng: 7.3986 },
  "Ibadan": { lat: 7.3775, lng: 3.9470 },
  "Cairo": { lat: 30.0444, lng: 31.2357 },
  "Alexandria": { lat: 31.2001, lng: 29.9187 },
  "Cape Town": { lat: -33.9249, lng: 18.4241 },
  "Johannesburg": { lat: -26.2041, lng: 28.0473 },
  "Nairobi": { lat: -1.2921, lng: 36.8219 },
  "Mombasa": { lat: -4.0435, lng: 39.6682 },
  "Manila": { lat: 14.5995, lng: 120.9842 },
  "Cebu": { lat: 10.3157, lng: 123.8854 },
  "Kuala Lumpur": { lat: 3.1390, lng: 101.6869 },
  "Johor Bahru": { lat: 1.4927, lng: 103.7414 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Melbourne": { lat: -37.8136, lng: 144.9631 },
  "Toronto": { lat: 43.6532, lng: -79.3832 },
  "Vancouver": { lat: 49.2827, lng: -123.1207 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Munich": { lat: 48.1351, lng: 11.5820 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "Lyon": { lat: 45.7640, lng: 4.8357 },
  "São Paulo": { lat: -23.5505, lng: -46.6333 },
  "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
  "Riyadh": { lat: 24.7136, lng: 46.6753 },
  "Jeddah": { lat: 21.4858, lng: 39.1925 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Abu Dhabi": { lat: 24.4539, lng: 54.3773 }
};

export function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const { data: globalUsers } = useQuery({
    queryKey: ["/api/scoreboard/global"],
    queryFn: async () => {
      const response = await fetch("/api/scoreboard/global?limit=100");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      
      // Add coordinates to users based on their city or country
      return users.map((user: any) => {
        let lat = CITY_COORDINATES[user.city]?.lat;
        let lng = CITY_COORDINATES[user.city]?.lng;
        
        // If no city coordinates, use random coordinates near major regions
        if (!lat || !lng) {
          // Generate random coordinates based on country or use random global locations
          const randomLocations = [
            { lat: 51.5074, lng: -0.1278 }, // London
            { lat: 40.7128, lng: -74.0060 }, // New York
            { lat: 35.6762, lng: 139.6503 }, // Tokyo
            { lat: -33.8688, lng: 151.2093 }, // Sydney
            { lat: 19.0760, lng: 72.8777 }, // Mumbai
            { lat: 55.7558, lng: 37.6176 }, // Moscow
            { lat: -23.5505, lng: -46.6333 }, // São Paulo
            { lat: 30.0444, lng: 31.2357 }, // Cairo
            { lat: 1.3521, lng: 103.8198 }, // Singapore
            { lat: 25.2048, lng: 55.2708 }, // Dubai
          ];
          const randomLocation = randomLocations[user.id % randomLocations.length];
          // Add some randomness around the location
          lat = randomLocation.lat + (Math.random() - 0.5) * 10;
          lng = randomLocation.lng + (Math.random() - 0.5) * 20;
        }
        
        return {
          ...user,
          latitude: lat,
          longitude: lng
        };
      });
    }
  });

  // Animation loop for smooth rotation
  useEffect(() => {
    const animate = () => {
      if (!isDragging && autoRotate) {
        setTargetRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
      }
      
      // Smooth interpolation towards target rotation
      setRotation(prev => ({
        x: prev.x + (targetRotation.x - prev.x) * 0.1,
        y: prev.y + (targetRotation.y - prev.y) * 0.1
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging, autoRotate, targetRotation]);

  // Render the globe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2 - 30;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas with space background
    const spaceGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
    spaceGradient.addColorStop(0, "#0a0a23");
    spaceGradient.addColorStop(1, "#000000");
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    drawStars(ctx, width, height);

    // Draw Earth with atmospheric glow
    drawAtmosphere(ctx, centerX, centerY, radius);
    
    const earthGradient = ctx.createRadialGradient(
      centerX - radius/3, centerY - radius/3, 0,
      centerX, centerY, radius
    );
    earthGradient.addColorStop(0, "#87CEEB");
    earthGradient.addColorStop(0.3, "#4682B4");
    earthGradient.addColorStop(0.7, "#1E90FF");
    earthGradient.addColorStop(1, "#000080");
    
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw continents with better detail
    ctx.fillStyle = "#228B22";
    drawDetailedContinents(ctx, centerX, centerY, radius, rotation);

    // Draw latitude/longitude grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    drawGlobeGrid(ctx, centerX, centerY, radius, rotation);

    // Draw user locations with enhanced visuals
    if (globalUsers) {
      globalUsers.forEach((user: UserLocation) => {
        const point = project3DTo2D(user.latitude, user.longitude, rotation, centerX, centerY, radius);
        if (point.visible && point.z > 0) {
          const size = 3 + (user.totalScore / 1000);
          
          // Glow effect
          const glowGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 2);
          glowGradient.addColorStop(0, "#FF6B35");
          glowGradient.addColorStop(0.5, "rgba(255, 107, 53, 0.5)");
          glowGradient.addColorStop(1, "rgba(255, 107, 53, 0)");
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2, 0, 2 * Math.PI);
          ctx.fill();
          
          // User marker
          ctx.fillStyle = user.totalScore > 2000 ? "#FFD700" : "#FF6B35";
          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.max(2, size), 0, 2 * Math.PI);
          ctx.fill();
          
          // Pulse animation for top users
          if (user.totalScore > 2000) {
            const pulseSize = size + Math.sin(Date.now() * 0.01) * 2;
            ctx.strokeStyle = "#FFD700";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulseSize, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
      });
    }

    // Draw equator line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    drawEquator(ctx, centerX, centerY, radius, rotation);

  }, [rotation, globalUsers]);

  const project3DTo2D = (lat: number, lng: number, rot: {x: number, y: number}, centerX: number, centerY: number, radius: number) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = ((lng + rot.y) * Math.PI) / 180;
    
    let x3d = Math.cos(latRad) * Math.cos(lngRad);
    let y3d = Math.cos(latRad) * Math.sin(lngRad);
    let z3d = Math.sin(latRad);
    
    // Rotation around X axis
    const rotXRad = (rot.x * Math.PI) / 180;
    const y3dRot = y3d * Math.cos(rotXRad) - z3d * Math.sin(rotXRad);
    const z3dRot = y3d * Math.sin(rotXRad) + z3d * Math.cos(rotXRad);
    
    const visible = x3d > 0; // Only show front hemisphere
    
    return {
      x: centerX + y3dRot * radius,
      y: centerY - z3dRot * radius,
      z: x3d,
      visible
    };
  };

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawAtmosphere = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const atmosphereGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 20);
    atmosphereGradient.addColorStop(0, "rgba(135, 206, 250, 0.3)");
    atmosphereGradient.addColorStop(1, "rgba(135, 206, 250, 0)");
    
    ctx.fillStyle = atmosphereGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawDetailedContinents = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, rot: {x: number, y: number}) => {
    const continentPaths = [
      // Africa - more detailed shape
      [
        { lat: 35, lng: 10 }, { lat: 30, lng: 30 }, { lat: 0, lng: 40 },
        { lat: -10, lng: 40 }, { lat: -35, lng: 20 }, { lat: -30, lng: 15 },
        { lat: -10, lng: 10 }, { lat: 10, lng: 0 }, { lat: 30, lng: 0 }
      ],
      // Europe
      [
        { lat: 60, lng: -10 }, { lat: 70, lng: 20 }, { lat: 60, lng: 40 },
        { lat: 45, lng: 35 }, { lat: 40, lng: 10 }, { lat: 45, lng: -5 }
      ],
      // Asia
      [
        { lat: 70, lng: 60 }, { lat: 60, lng: 140 }, { lat: 20, lng: 140 },
        { lat: 10, lng: 100 }, { lat: 30, lng: 80 }, { lat: 40, lng: 60 }
      ],
      // North America
      [
        { lat: 70, lng: -120 }, { lat: 60, lng: -60 }, { lat: 25, lng: -80 },
        { lat: 30, lng: -120 }, { lat: 50, lng: -140 }
      ],
      // South America
      [
        { lat: 10, lng: -70 }, { lat: 0, lng: -50 }, { lat: -20, lng: -40 },
        { lat: -55, lng: -70 }, { lat: -20, lng: -80 }, { lat: 0, lng: -80 }
      ]
    ];

    continentPaths.forEach(continent => {
      ctx.beginPath();
      let firstPoint = true;
      
      continent.forEach(point => {
        const projected = project3DTo2D(point.lat, point.lng, rot, centerX, centerY, radius);
        if (projected.visible && projected.z > 0) {
          if (firstPoint) {
            ctx.moveTo(projected.x, projected.y);
            firstPoint = false;
          } else {
            ctx.lineTo(projected.x, projected.y);
          }
        }
      });
      
      ctx.closePath();
      ctx.fill();
    });
  };

  const drawEquator = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, rot: {x: number, y: number}) => {
    ctx.beginPath();
    let firstPoint = true;
    
    for (let lng = -180; lng <= 180; lng += 2) {
      const point = project3DTo2D(0, lng, rot, centerX, centerY, radius);
      if (point.visible && point.z > 0) {
        if (firstPoint) {
          ctx.moveTo(point.x, point.y);
          firstPoint = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
    }
    ctx.stroke();
  };

  const drawContinents = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, rot: {x: number, y: number}) => {
    // Simplified continent shapes
    const continents = [
      // Africa
      { lat: 0, lng: 20, size: 30 },
      // Europe
      { lat: 50, lng: 10, size: 20 },
      // Asia
      { lat: 30, lng: 100, size: 40 },
      // North America
      { lat: 45, lng: -100, size: 35 },
      // South America
      { lat: -15, lng: -60, size: 25 },
      // Australia
      { lat: -25, lng: 135, size: 15 }
    ];

    continents.forEach(continent => {
      const point = project3DTo2D(continent.lat, continent.lng, rot, centerX, centerY, radius);
      if (point.visible) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, continent.size, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const drawGlobeGrid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, rot: {x: number, y: number}) => {
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lng = -180; lng <= 180; lng += 5) {
        const point = project3DTo2D(lat, lng, rot, centerX, centerY, radius);
        if (point.visible) {
          if (lng === -180) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }
    
    // Longitude lines
    for (let lng = -150; lng <= 150; lng += 30) {
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 5) {
        const point = project3DTo2D(lat, lng, rot, centerX, centerY, radius);
        if (point.visible) {
          if (lat === -90) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    // Increased sensitivity for easier control
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.8)),
      y: prev.y + deltaX * 0.8
    }));
    
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setAutoRotate(true), 2000); // Resume auto-rotation after 2 seconds
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setAutoRotate(false);
    setLastMouse({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMouse.x;
    const deltaY = touch.clientY - lastMouse.y;
    
    // Increased sensitivity for touch devices
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.8)),
      y: prev.y + deltaX * 0.8
    }));
    
    setLastMouse({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setTimeout(() => setAutoRotate(true), 2000);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!globalUsers) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    // Scale mouse coordinates to match canvas internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
    
    // Find closest user to click
    let closestUser: UserLocation | null = null;
    let closestDistance = Infinity;
    
    globalUsers.forEach((user: UserLocation) => {
      const point = project3DTo2D(user.latitude, user.longitude, rotation, centerX, centerY, radius);
      if (point.visible) {
        const distance = Math.sqrt(Math.pow(clickX - point.x, 2) + Math.pow(clickY - point.y, 2));
        if (distance < 15 && distance < closestDistance) {
          closestDistance = distance;
          closestUser = user;
        }
      }
    });
    
    setSelectedUser(closestUser);
  };

  // Preset view functions
  const rotateToRegion = (targetRotation: {x: number, y: number}) => {
    setAutoRotate(false);
    setRotation(targetRotation);
    setTimeout(() => setAutoRotate(true), 3000);
  };

  const resetView = () => {
    setAutoRotate(false);
    setRotation({ x: 0, y: 0 });
    setTimeout(() => setAutoRotate(true), 1000);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Control Instructions */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
        Drag to rotate • Click users
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        <button
          onClick={resetView}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
          title="Reset View"
        >
          🌍 Reset
        </button>
        <button
          onClick={() => rotateToRegion({ x: 20, y: -30 })}
          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded transition-colors"
          title="View Europe"
        >
          🇪🇺 Europe
        </button>
        <button
          onClick={() => rotateToRegion({ x: 20, y: 70 })}
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1 rounded transition-colors"
          title="View Asia"
        >
          🌏 Asia
        </button>
        <button
          onClick={() => rotateToRegion({ x: 30, y: -100 })}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded transition-colors"
          title="View Americas"
        >
          🌎 Americas
        </button>
      </div>

      {/* Auto-rotate toggle */}
      <div className="absolute bottom-2 right-2 z-10">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            autoRotate 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
          title={autoRotate ? "Stop Auto-Rotation" : "Start Auto-Rotation"}
        >
          {autoRotate ? "⏸️ Pause" : "▶️ Auto"}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border rounded-lg cursor-grab active:cursor-grabbing bg-gradient-to-br from-slate-900 to-blue-900 w-full h-auto max-w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      />
      
      {selectedUser && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{selectedUser.flagEmoji}</span>
            <div>
              <h3 className="font-bold text-gray-900">{selectedUser.username}</h3>
              <p className="text-sm text-gray-600">{selectedUser.city}, {selectedUser.country}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Score:</span>
              <span className="font-semibold text-blue-600">{selectedUser.totalScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-semibold text-green-600">{selectedUser.accuracyRate}%</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedUser(null)}
            className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            autoRotate 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {autoRotate ? 'Pause' : 'Rotate'}
        </button>
        <button
          onClick={() => {
            setTargetRotation({ x: 0, y: 0 });
            setAutoRotate(true);
          }}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>
      
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm">
        <div className="space-y-1">
          <div>🌍 Interactive Globe</div>
          <div>👆 Click and drag to rotate</div>
          <div>🔍 Click markers for details</div>
          <div className="text-xs text-gray-300 mt-2">
            {globalUsers?.length || 0} users worldwide
          </div>
        </div>
      </div>
    </div>
  );
}