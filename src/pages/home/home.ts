// The MIT License (MIT) Copyright (c)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Original work Copyright (c) 2017 Adrián Brito

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import  { StatsLineChart } from '../../data/data'

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title: string = 'D3.js with Ionic 2!';
  subtitle: string = 'Line Chart';

  margin = {top: 20, right: 20, bottom: 30, left: 50};
  width: number;
  height: number;
  x: any;
  y: any;
  svg: any;
  miSvg: any;
  line: d3Shape.Line<[number, number]>;
  icons: string = "camera";

  constructor(public navCtrl: NavController) {
    this.width = 450 - this.margin.left - this.margin.right ;
    this.height = 250 - this.margin.top - this.margin.bottom;
  }

  ionViewDidLoad() {
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawLine();
    this.eventCapture();    
  }

  initSvg() {
    this.miSvg = d3.select("#lineChart")
      // .append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox','0 0 450 250');

    this.svg = this.miSvg
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(StatsLineChart, (d) => d.date ));
    this.y.domain(d3Array.extent(StatsLineChart, (d) => d.value ));
    console.log("height");
    console.log(this.height);
    console.log(typeof(this.y));
    console.log(d3Array.extent(StatsLineChart, (d) => d.value ));
  }

  eventCapture(){
    var self = this;
    this.miSvg.on("click", function() {
      var coords = d3.mouse(this);
      var newHeight = coords[1];
      console.log("newHeight");
      var newScaledHeight = self.y.invert(newHeight - self.margin.top);
      self.moveLine(newScaledHeight);
    });
  }  

  moveLine(newHeight){
    var oldLine = d3.select("#" + this.icons);
    if(oldLine != null){
      oldLine.remove();
    }
    this.drawLineWithHeight(newHeight);
  }

  drawAxis() {
    this.svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3Axis.axisBottom(this.x));

    this.svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3Axis.axisLeft(this.y))
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
  }

  drawLine() {
    this.line = d3Shape.line()
        .x( (d: any) => this.x(d.date) )
        .y( (d: any) => this.y(d.value) );

    this.svg.append("path")
        .datum(StatsLineChart)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", this.line);
  }

  drawLineWithHeight(height) {
    this.line = d3Shape.line()
        .x( (d: any) => this.x(d.date) )
        .y( (d: any) => this.y(height) );

    this.svg.append("path")
        .datum(StatsLineChart)
        .attr("id", this.icons)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", this.line);
  }
}