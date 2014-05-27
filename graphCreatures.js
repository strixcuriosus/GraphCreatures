//each graph has a velocity
var width = 960,
    height = 500;

var color = d3.scale.category20();



var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);



function collide(node) {
  var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}



var makeGraph = function (nodeCount, graphClass, offset) {
    var linkClass = graphClass + "link";
  // var generateGraphData = function () {
    var graph = { nodes: [], links:[] };
    for (var i = 0; i < nodeCount; i++) {
      // var nextRand = Math.floor(Math.random() * 6);
      // console.log(nextRand);
      graph.nodes.push({group: i % 6, x: offset, y:offset});
      graph.links.push({source: i, target: Math.round(i / 3), value: i % 4});
      graph.links.push({source: i, target: Math.round(i / 4), value: i % 4});
    }
    graph.velocity = 0.5;

    
    var force = d3.layout.force()
    .charge(function(d,i){
      if (i===0) {
        return -500;
      } else {
        return -500
      }
    })
    .linkDistance(10)
    .size([width, height]);

  

  force
  // .gravity(0.1)
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    graph.node = svg.selectAll(graphClass)
        .data(graph.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("class", graphClass)
        .attr("r", 5)
        // .attr("")
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    graph.link = svg.selectAll(linkClass)
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      // .attr("class", linkClass)
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  force.on("tick", function() {
    // updateNodePositions(graph);
    var q = d3.geom.quadtree(graph.node),
      i = 0,
      n = graph.node.length;

  while (++i < n) q.visit(collide(nodes[i]));

  svg.selectAll("circle")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

    graph.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    graph.node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });


    graph.updateNodePositions = function () {
      for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].x += graph.velocity + (Math.random() - 0.5) * 5;
        graph.nodes[i].y += graph.velocity + (Math.random() - 0.5) * 5;
      } 
      graph.node
      .data(graph.nodes) 
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

      graph.link
      .data(graph.links)
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    }
    // return graph;
  // }
  
  // console.log(graph,'ggggggg');
  var root = graph.node[0];
  var next = graph.node[1];


  // svg.on("mousemove", function() {
  // var p1 = d3.mouse(this);
  // root.px = p1[0];
  // root.py = p1[1];
  // if (next) {
  //   if (next.x > root.px) {
  //     graph.velocity = 30;
  //   } else {
  //     graph.velocity = -3;
  //   }
  //   force.resume();
  //   }
  // });


  var allnodes = svg.selectAll('circle');

  allnodes.on("mouseover", function() {
    var selected = d3.select(this);
    var sdata = selected.data();
    sdata.x += 300;
    selected.data(sdata)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

    graph.updateNodePositions();
    force.resume();
    // debugger;
  });

  var interval = 100;
  setInterval(graph.updateNodePositions, interval);
  console.log(graph.nodes, '!!')
  return graph;
}


var g = makeGraph(5, 'g1', 1);
var g2 = makeGraph(3, 'g2', 200);
// var g3 = makeGraph(7, 'g2', 1000);
console.log(g,'!!!!');
// var nodeCount = 15;


// var graph = generateGraphData();
// console.log(graph);

// var updateNodePositions = function (graph) {
//     var mover = Math.floor(graph.nodes.length * Math.random());
//     for (var i = 0; i < graph.nodes.length; i++) {
//       graph.nodes[i].x += graph.velocity + (Math.random() - 0.5) * 15;
//       graph.nodes[i].y += graph.velocity + (Math.random() - 0.5) * 15;
//     } 
//     var node = svg.selectAll(".node")
//       .data(graph.nodes) 
//       // .transition()
//       .attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; });
//     var link = svg.selectAll(".link")
//       .data(graph.links)
//       // .transition()
//       .attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });
// }




// setInterval(function(){updateNodePositions(graph)}, interval)
// var makeUpdate = function (graph) {
//   return function (graph) {
//     updateNodePositions(graph);
//     d3.timer(makeUpdate(graph), interval);
//     return true;
//   }
// };

// d3.timer(makeUpdate(graph), interval);






  

  // var root = node[0];
  // var next = node[1];



  

  // console.log(graph);

