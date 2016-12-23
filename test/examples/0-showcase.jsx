import React from 'react';
import _ from 'lodash';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ShowcaseLayout extends React.Component {

  static propTypes = {
    onLayoutChange: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
    initialLayout: generateLayout()
  };

  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: {lg: this.props.initialLayout},
  };

  componentDidMount() {
    this.setState({mounted: true});
  }

  generateDOM() {
    return _.map(this.state.layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? 'static' : ''}>
          {l.static ?
            <span className="text" title="This item is static and cannot be removed or resized.">Static - {i}</span>
            : <span className="text">{i}</span>
          }
        </div>);
    });
  }

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout = () => {
    this.setState({
      layouts: {lg: generateLayout()}
    });
  };

  render() {
    return (
      <div>
        <div>Current Breakpoint: {this.state.currentBreakpoint} ({this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          dynamicCompact={true}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}>
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

module.exports = ShowcaseLayout;

function generateLayout() {
  let heights = [{h:4, w:2}, {h:8, w:2}, {h:8, w:4}];
  let q = 0;
  return _.map(_.range(0, 10), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    let r = _.random(0,2);
    let draggable = true;
    let section = false;
    let resize = true;
    let xcord = _.random(0, 5) * 2 % 12;
    let ycord = Math.floor(i / 6) * y;
    let w = heights[r].w;
    let h = heights[r].h;
    if (q % 5 === 0) {
      draggable = false;
      section = true;
      resize = false;
      xcord = 0;
      ycord = q * 2;
      w = 12;
      h = 5;
    }
    q++;
    return {
      x: xcord,
      y: ycord,
      w: w,
      h: h,
      i: i.toString(),
      isSection: section,
      isDraggable: draggable,
      isResizable: resize,
      static: false
    };
  });
}

if (require.main === module) {
  require('../test-hook.jsx')(module.exports);
}
