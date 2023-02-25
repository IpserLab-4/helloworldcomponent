import React from "react" ;
import Axios from "axios" ;
import {Editor} from "react-draft-wysiwyg" ;
import {EditorState, ContentState, convertFromHTML, convertToRaw} from "draft-js" ;
import draftToHtml from "draftjs-to-html" ;

var prefix = "" ;
function getPrefix () {return prefix?prefix:"" ;}
function setPrefix (newprefix) {prefix = newprefix ;}

var session = JSON.parse(localStorage.getItem('user')) ;
function getSession () {return session ;}
function setSession (newsession) {session = newsession ;}

//Modify to include join option
//If token fails try email/passcode combination from last successful signin
class BandungComponent
	extends React.Component
{
	constructor (props)
	{
        super(props) ;
		this.id = props.id ;
        this.page = 0 ;
        this.state = {
			command:this.props.command?this.props.command:"List",
			commandList:this.props.commandList?this.props.commandList:"List",
            loading: false,
            errorMessage: null,
        } ;
	}
	command (command)
	{
	    this.setState({command:command}) ;
	}
	renderSignin ()
	{
		return(
            <div className="sign-in-form">
                <form onSubmit={(event) => {this.executeSignin(event)}}>
                    <div className="title">Sign in</div>
                    <p className="details">Enter your signin details here</p>
                    {this.state.errorMessage && <div className="error_message">{this.state.errorMessage}</div>}
                    <div className="email">
                        <input id="email" name="email" className="email_field" type='email' placeholder = "Enter your email address..." autoComplete="off" required/>
                    </div>
                    <div className="password">
                        <input id="password" name="password" className="password_field" type='password' placeholder = "Enter your password..." autoComplete="off" required/>
                    </div>
                    <div className="button">
                        <button>{this.state.loading? "Submiting...": "Submit"}</button>
                    </div>
                </form>
            </div>
        )
	}
	signin (email, password)
	{
        this.setState({...this.state,loading: true}) ;
        Axios.get(getPrefix()+"/app/session/signin?sessionEmail="+email+"&sessionPassword="+password,null)
            .then(response=>{
                if (response.data.error){
                    this.setState({...this.state, isError:true, errorMessage:response.data.error,loading: false})
                } else{
                    session = response.data ;
                    localStorage.setItem('user',JSON.stringify(session)) ;
                    this.setState({errorMessage:null}) ;
                }
            })
            .catch (err=>{
                console.log(err);
                this.setState({...this.state, isError:true, errorMessage: "Something went wrong..., please try again"})
            })
            .finally (status=>{
              this.setState({ loading: false})
            })
	}
    executeSignin (event)
    {
        event.preventDefault() ;
        this.signin(document.getElementById("email").value,document.getElementById("password").value) ;
        this.setState({...this.state,loading:true}) ;
    }
	signout ()
	{
        session = {} ;
        localStorage.setItem('user',"{}") ;
        window.location.reload() ;
	}
    executeSignout ()
    {
        this.signout() ;
    }
}

//Model on https://www.ipserlab.com/profile
class ProfileComponent
	extends BandungComponent
{
	constructor (props)
	{
		super(props) ;
		this.state =
		{
		    command: null,
		    userEntity: {},
		    userEmailEntity: {},
		    userEmailEntityList: [],
		} ;
		this.longDescriptionEditorState = EditorState.createEmpty() ;
	}
	componentDidMount () {this.getProfile() ;}
	command (command)
	{
	    this.setState({command:command}) ;
	}
	render ()
	{
console.log(this.state.command) ;
console.log(session) ;
        return (
            <div>
                <table>
                <tbody>
                <tr>
                <td>
                <p onClick={()=>{this.command("General")}} style={{cursor:'pointer'}}>General</p>
                <p onClick={()=>{this.command("Settings")}} style={{cursor:'pointer'}}>Settings</p>
                <p onClick={()=>{this.command("Bio")}} style={{cursor:'pointer'}}>Bio</p>
                </td>
                <td>
                {
                    (!this.state.command||this.state.command==="General") ? this.renderProfileGeneral() :
                    (this.state.command==="GeneralUpdate") ? this.renderProfileGeneralUpdate() :
                    (this.state.command==="Settings") ? this.renderProfileSettings() :
                    (this.state.command==="SettingsUpdate") ? this.renderProfileSettingsUpdate() :
                    (this.state.command==="Bio") ? this.renderProfileBio() :
                    (this.state.command==="BioUpdate") ? this.renderProfileBioUpdate() :
            		//similarly for others
                    this.renderProfileGeneral()
                }
                </td>
                </tr>
                </tbody>
                </table>
            </div>
        ) ;
	}
	getProfile ()
	{
	    if (session.userEntityId)
	    {
            Axios.get(getPrefix()+"/app/user/view?sessionToken="+getSession().sessionToken+"&userEntityId="+session.userEntityId,null)
                .then(response=>{this.setState({userEntity:response.data})}) ;
            Axios.get(getPrefix()+"/app/user/textshortdescription?sessionToken="+getSession().sessionToken+"&userEntityId="+session.userEntityId,null)
                .then(response=>{this.setState({shortDescription:response.data})}) ;
            Axios.get(getPrefix()+"/app/user/textlongdescription?sessionToken="+getSession().sessionToken+"&userEntityId="+session.userEntityId,null)
                .then(response=>{this.setState({longDescription:response.data})}) ;
        }
	}
	renderProfileGeneral ()
	{
	    //shortDescription
		return(
		<div>
		    <h1>Profile: General</h1>
		    <p>Name: {this.state.userEntity.firstName} {this.state.userEntity.lastName}</p>
		    <p>Created: {this.state.userEntity.createDate}</p>
		    <p>Modified: {this.state.userEntity.modifyDate}</p>
            <p onClick={()=>{this.command("GeneralUpdate")}} style={{cursor:'pointer'}}>Update</p>
		</div>
		) ;
	}
	renderProfileGeneralUpdate ()
	{
		this.longDescriptionEditorState = EditorState.createEmpty() ;
		return(
			<div className="update_div">
				<form onSubmit={(event)=>{this.executeProfileGeneralUpdate(event)}}>
				<p><input id="ProfileFirstName" name="profileFirstName" className="input_field fields" type="text" defaultValue={this.state.userEntity.firstName?this.state.userEntity.firstName:""}/></p>
				<p><input id="ProfileLastName" name="profileLastName" className="input_field fields" type="text" defaultValue={this.state.userEntity.lastName?this.state.userEntity.lastName:""}/></p>
				<textarea id="ProfileShortDescription" name="shortDescription" className="text_area fields" defaultValue={this.state.shortDescription?this.state.shortDescription:""} rows="4" cols="50"></textarea>
				<div className="button"><button className="update_button" type="submit">Update</button></div>
				</form>
			</div>
		) ;
	}
	executeProfileGeneralUpdate (event)
	{
		event.preventDefault() ;
		const form = new FormData() ;
		form.append('sessionToken',getSession().sessionToken) ;
		form.append('userEntityId',this.state.userEntity.userEntityId) ;
		form.append('firstName',document.getElementById("ProfileFirstName").value) ;
		form.append('lastName',document.getElementById("ProfileLastName").value) ;
		form.append('shortDescription',document.getElementById("ProfileShortDescription").value) ;
		Axios.post(getPrefix()+"/app/user/update",form).then(response=>{this.setState({command:"General"});this.getProfile();}) ;
    }
	renderProfileSettings ()
	{
	    //Use Html
        //Notifications
		return(
		<div>
		    <h1>Profile: Settings</h1>
            <p onClick={()=>{this.command("SettingsUpdate")}} style={{cursor:'pointer'}}>Update</p>
		</div>
		) ;
	}
	renderProfileSettingsUpdate ()
	{
	    //Use Html
        //Notifications
	}
	executeProfileSettingsUpdate (event)
	{
		event.preventDefault() ;
		const form = new FormData() ;
		form.append('sessionToken',getSession().sessionToken) ;
		form.append('userEntityId',this.state.userEntity.userEntityId) ;
		Axios.post(getPrefix()+"/app/user/update",form).then(response=>{this.setState({command:"Settings"});this.getProfile();}) ;
    }
	//password
	//contact
	//bio
	renderProfileBio ()
	{
	    //longDescription
		return(
		<div>
		    <h1>Profile: Settings</h1>
            <p onClick={()=>{this.command("SettingsUpdate")}} style={{cursor:'pointer'}}>Update</p>
		</div>
		) ;
	}
	renderProfileBioUpdate ()
	{
	    //longDescription
	}
	executeProfileBioUpdate (event)
	{
		event.preventDefault() ;
		const form = new FormData() ;
		form.append('sessionToken',getSession().sessionToken) ;
		form.append('userEntityId',this.state.userEntity.userEntityId) ;
		form.append('longDescription',draftToHtml(convertToRaw(this.longDescriptionEditorState.getCurrentContent()))) ;
		Axios.post(getPrefix()+"/app/user/update",form).then(response=>{this.setState({command:"Bio"});this.getProfile();}) ;
    }
	//emails
	//socials
	//image
	//quit
}

export {getPrefix,setPrefix,getSession,setSession,BandungComponent,ProfileComponent} ;
