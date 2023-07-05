function drawCircle(target,r,container)
{
  const containerRect = container.getBoundingClientRect();
  console.log(containerRect);
  // Create an SVG element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Set the SVG attributes (e.g., width, height)
  var realCX = target.getBoundingClientRect().left - containerRect.left + target.getBoundingClientRect().width/2;
  var realCY = target.getBoundingClientRect().top - containerRect.top + target.getBoundingClientRect().height/2;
  svg.setAttribute("width", containerRect.width.toString());
  svg.setAttribute("height", containerRect.height.toString());
  svg.setAttribute("left", containerRect.left.toString());
  svg.setAttribute("top", containerRect.top.toString());
  //svg.setAttribute("border", "2px solid red");
  // Create a circle element
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  // Set the circle attributes (e.g., cx, cy, r, fill)
  circle.setAttribute("cx", realCX.toString());
  circle.setAttribute("cy", realCY.toString());
  circle.setAttribute("r", r.toString());
  circle.setAttribute("fill", "white");
  circle.setAttribute("stroke", "black");
  circle.setAttribute("stroke-dasharray", "5,5");

  // Append the circle to the SVG element
  svg.appendChild(circle);

  // Append the SVG element to the div
  container.appendChild(svg);
}

function checkCollisionAABBs(element, elements)
{
  for (const rect of elements) {
    if (
      element.x < rect.x + rect.width &&
      element.x + element.width > rect.x &&
      element.y < rect.y + rect.height &&
      element.y + element.height > rect.y
    ) {
        return true;
    }
  }
  return false;
}

function calculateProjection(x, y, Vx, Vy) {
    const dotProduct = x * Vx + y * Vy;
    const magnitudeSquared = Vx * Vx + Vy * Vy;
    
    const projectionX = (dotProduct / magnitudeSquared) * Vx;
    const projectionY = (dotProduct / magnitudeSquared) * Vy;
    
    return { x: projectionX, y: projectionY };
  }

function checkPolygonCollision(poly1, poly2) {
    // Loop through each edge of both polygons
    for (let i = 0; i < poly1.length; i++) {
        const edge = getEdge(poly1, i);

        // Project polygons onto the axis perpendicular to the edge
        const projection1 = projectPolygon(poly1, edge);
        const projection2 = projectPolygon(poly2, edge);

        // Check if projections overlap
        if (!isOverlap(projection1, projection2)) {
        // Separating axis found, polygons do not collide
        return false;
        }
    }

    // No separating axis found, polygons collide
    return true;
}

function getEdge(poly, index) {
    const point1 = poly[index];
    const point2 = poly[(index + 1) % poly.length];
    const edge = {
        x: point2.x - point1.x,
        y: point2.y - point1.y
    };
    return edge;
}

function projectPolygon(poly, axis) {
    const projection = {
        min: dotProduct(poly[0], axis),
        max: dotProduct(poly[0], axis)
    };

    for (let i = 1; i < poly.length; i++) {
        const dot = dotProduct(poly[i], axis);
        projection.min = Math.min(projection.min, dot);
        projection.max = Math.max(projection.max, dot);
    }

    return projection;
}

function dotProduct(point, axis) {
    return point.x * axis.x + point.y * axis.y;
}

function isOverlap(projection1, projection2) {
    return projection1.max >= projection2.min && projection2.max >= projection1.min;
}
  

function getRotatedPos(poly, angle)
{
    // Calculate center point of the rectangle
    const centerX = (poly[0].x + poly[1].x + poly[2].x + poly[3].x) / 4;
    const centerY = (poly[0].y + poly[1].y + poly[2].y + poly[3].y) / 4;

    // Translate rectangle to center at origin
    const translatedX1 = poly[0].x - centerX;
    const translatedY1 = poly[0].y - centerY;
    const translatedX2 = poly[1].x - centerX;
    const translatedY2 = poly[1].y - centerY;
    const translatedX3 = poly[2].x - centerX;
    const translatedY3 = poly[2].y - centerY;
    const translatedX4 = poly[3].x - centerX;
    const translatedY4 = poly[3].y - centerY;

    // Apply rotation transformation
    const rotatedX1 = translatedX1 * Math.cos(Math.PI / 4) - translatedY1 * Math.sin(Math.PI / 4);
    const rotatedY1 = translatedX1 * Math.sin(Math.PI / 4) + translatedY1 * Math.cos(Math.PI / 4);
    const rotatedX2 = translatedX2 * Math.cos(Math.PI / 4) - translatedY2 * Math.sin(Math.PI / 4);
    const rotatedY2 = translatedX2 * Math.sin(Math.PI / 4) + translatedY2 * Math.cos(Math.PI / 4);
    const rotatedX3 = translatedX3 * Math.cos(Math.PI / 4) - translatedY3 * Math.sin(Math.PI / 4);
    const rotatedY3 = translatedX3 * Math.sin(Math.PI / 4) + translatedY3 * Math.cos(Math.PI / 4);
    const rotatedX4 = translatedX4 * Math.cos(Math.PI / 4) - translatedY4 * Math.sin(Math.PI / 4);
    const rotatedY4 = translatedX4 * Math.sin(Math.PI / 4) + translatedY4 * Math.cos(Math.PI / 4);

    // Translate rectangle back to original position
    const newX1 = rotatedX1 + centerX;
    const newY1 = rotatedY1 + centerY;
    const newX2 = rotatedX2 + centerX;
    const newY2 = rotatedY2 + centerY;
    const newX3 = rotatedX3 + centerX;
    const newY3 = rotatedY3 + centerY;
    const newX4 = rotatedX4 + centerX;
    const newY4 = rotatedY4 + centerY;
}

function checkProximity(element, target, Factor)
{
  if(Factor.proximity == null)
    return true;
  var dx = element.x + element.width/2-target.x - target.width/2;
  var dy = element.y + element.height/2-target.y - target.height/2;
  return (Math.sqrt(dx**2 +dy**2) >= Factor.proximity);
}