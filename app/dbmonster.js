import React from 'react';
import getData from './data';

import {
  StyleSheet,
  Text,
  View,
} from './../custom-react-vr/react-vr';

const lpad = (padding, toLength, str) => padding.repeat((toLength - str.length) / padding.length).concat(str);

const formatElapsed = (value) => {
  var str = parseFloat(value).toFixed(2);
  if (value > 60) {
    minutes = Math.floor(value / 60);
    comps = (value % 60).toFixed(2).split('.');
    seconds = lpad('0', 2, comps[0]);
    ms = comps[1];
    str = minutes + ":" + seconds + "." + ms;
  }
  return str;
};

class Query extends React.Component {
  constructor(p) {
    super(p);
    this.state = { showQuery: 0 }
  }
  handleEnter() {
    this.setState({ showQuery: 1 })
  }

  handleExit() {
    this.setState({ showQuery: 0 })
  }

  render() {
    var className = "elapsedShort";
    if (this.props.elapsed >= 10.0) {
      className = "elapsedWarnLong";
    } else if (this.props.elapsed >= 1.0) {
      className = "elapsedWarn";
    }

    return (
      <View style={[styles.cell, styles.query, styles[className]]} onEnter={() => this.handleEnter()} onExit={() => this.handleExit()}>
        <Text style={styles.text}>{this.props.elapsed ? formatElapsed(this.props.elapsed) : '-'}</Text>
        <Text style={[styles.text, styles.popOver, { opacity: this.state.showQuery ? 1 : 0 }]}>{this.props.query}</Text>
      </View>
    );
  }
}


class Database extends React.Component {
  sample(queries, time) {
    var topFiveQueries = queries.slice(0, 5);
    while (topFiveQueries.length < 5) {
      topFiveQueries.push({ query: "" });
    }

    var _queries = [];
    topFiveQueries.forEach(function (query, index) {
      _queries.push(
        <Query
          key={index}
          query={query.query}
          elapsed={query.elapsed}
          />
      );
    });

    var countClassName = "";
    if (queries.length >= 20) {
      countClassName = "labelImportant";
    }
    else if (queries.length >= 10) {
      countClassName = "labelWarning";
    }
    else {
      countClassName = "labelSuccess";
    }

    return [
      <View style={[styles.cell, styles.queryCount, styles[countClassName]]} key="1">
        <Text style={[styles.text, styles.label]}>
          {queries.length}
        </Text>
      </View>,
      _queries
    ];
  };

  render() {
    var lastSample = this.props.samples[this.props.samples.length - 1];

    return (
      <View key={this.props.dbname} style={styles.row}>
        <View style={[styles.cell, styles.dbname]}>
          <Text style={[styles.text]}>{this.props.dbname}</Text>
        </View>
        {this.sample(lastSample.queries, lastSample.time)}
      </View>
    );
  };
};

export default class DBMon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databases: {}
    };
  };

  loadSamples() {
    var newData = getData(this.props.rows || 10);
    Object.keys(newData.databases).forEach((dbname) => {
      var sampleInfo = newData.databases[dbname];
      if (!this.state.databases[dbname]) {
        this.state.databases[dbname] = {
          name: dbname,
          samples: []
        }
      }

      var samples = this.state.databases[dbname].samples;
      samples.push({
        time: newData.start_at,
        queries: sampleInfo.queries
      });
      if (samples.length > 5) {
        samples.splice(0, samples.length - 5);
      }
    });

    this.setState(this.state);
    setTimeout(() => this.loadSamples(), this.props.timeout || 1);
  };

  componentDidMount() {
    this.loadSamples();
  };

  render() {
    var databases = [];
    Object.keys(this.state.databases).forEach(function (dbname) {
      databases.push(
        <Database key={dbname}
          dbname={dbname}
          samples={this.state.databases[dbname].samples} />
      );
    }.bind(this));

    return (
      <View style={styles.table}>
        {databases}
      </View>
    );
  };
}

var styles = StyleSheet.create({
  table: {
    transform: [{ translate: [0, 0, -35] }],
    layoutOrigin: [0.5, 0.5],
  },
  row: {
    flexDirection: 'row',
    flexGrow: 1
  },
  cell: {
    borderColor: 'black',
    borderWidth: 0.01,
    padding: 0.1,
    backgroundColor: 'white',
    margin: 0.05
  },
  label: {
  },
  labelWarning: {
    backgroundColor: '#f0ad4e'
  },
  labelSuccess: {
    backgroundColor: '#5cb85c'
  },
  labelImportant: {
    backgroundColor: '#d9534f'
  },
  queryCount: {
    width: 1,
    alignItems: 'flex-end'
  },
  dbname: {
    width: 4
  },
  query: {
    width: 2,
    alignItems: 'flex-end'
  },
  elapsedShort: {

  },
  elapsedWarnLong: {

  },
  elapsedWarn: {

  },
  popOver: {
    opacity: 0,
    position: 'absolute',
    fontSize: 0.3,
    layoutOrigin: [0.5, 0.5],
    backgroundColor: 'white',
    padding: 0.1,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 0.5,
    color: '#333',
  }
});