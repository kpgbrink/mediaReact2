import React from 'react';
import $ from 'jquery';

const Table = require('rc-table');
import Animate from 'rc-animate';

import CatalogTable from './CatalogBoxComponents/CatalogTable.js';
import CatalogForm from './CatalogBoxComponents/CatalogForm.js';
import {API_CATALOG} from '../global.js';
import {API_CATALOG_TYPE} from '../global.js';
import {API_CATALOG_BOOK} from '../global.js';
import {API_CATALOG_MUSIC} from '../global.js';
import {API_CATALOG_MOVIE} from '../global.js';

require('rc-table/assets/index.css');
require('rc-table/assets/animation.css');

var type;

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pendingId: 0
        };
        this.allowAjaxResponse = true;
    }

    //All posts
    loadPostsFromServer() {
        $.ajax({
            url: API_CATALOG,
            dataType: 'json'
        })
         .done(function(result){
             if (this.allowAjaxResponse) {
                this.setState({data: result});
             }
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    }

    loadPostsFromServerType(type) {
        $.ajax({
            url: API_CATALOG_TYPE + "/" + type,
            dataType: 'json'
        })
         .done(function(result){
             if (this.allowAjaxResponse) {
                this.setState({data: result});
             }
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    }

    handlePostSubmit(post) {
        var posts = this.state.data;
        post._id = `prefixId-${this.state.pendingId}`;
        var newPosts = [post].concat(posts);
        this.setState({data: newPosts, pendingId: this.state.pendingId+1});
        $.ajax({
            url: API_CATALOG,
            dataType: 'json',
            type: 'POST',
            data: post,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             this.setState({data: posts});
             console.error(API_CATALOG, status, errorThrown.toString());
             alert('Please Login');
         }.bind(this));
    }
    
    //To Do: Fix This
    onDelete(record, e) {

        this.setState({ data: this.state.data.filter(iterRecord => record._id !== iterRecord._id)});
        
        this.handleDelete(record._id);
    }

    handleDelete(id) {
        $.ajax({
          url: API_CATALOG + "/" + id,
          type: 'DELETE',
        })
        .done(function(result){
           this.setState({data: result});
        }.bind(this))
        .fail(function(xhr, status, errorThrown) {
           console.error(API_CATALOG, status, errorThrown.toString());
        }.bind(this));
    }

    componentDidMount() {
        this.loadPostsFromServer();
        // No more interval
        //setInterval(this.loadCommentsFromServer, POLL_INTERVAL);
    }
    componentWillUnmount() {
        this.allowAjaxResponse = false;
    }


  render() {
    return (
      <div className="catalog" style={{ margin: 20 }}>
        <h2>Add A Record To A Collection…</h2>
        <CatalogForm onPostSubmit={this.handlePostSubmit.bind(this)}/>
        <br></br>
        Choose your collection:
        <div className="catalog_buttons">
        <button className="ui-button ui-widget ui-corner-all" onClick={() => {this.loadPostsFromServerType("Book")}}>
        Books
        </button>
         <div className="divider"/>
        <button className="ui-button ui-widget ui-corner-all" onClick={() => {this.loadPostsFromServerType("Music")}}>
        Music
        </button>
         <div className="divider"/>
        <button className="ui-button ui-widget ui-corner-all" onClick={() => {this.loadPostsFromServerType("Movie")}}>
        Movies
        </button>
         <div className="divider"/>
        <button className="ui-button ui-widget ui-corner-all" onClick={() => {this.loadPostsFromServer()}}>
        All
        </button>
        </div>
        <CatalogTable onDelete={this.onDelete.bind(this)} data={this.state.data}/>
      </div>
    );
  }
}
