import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
// import SelectListGroup from '../common/SelectListGroup';
import { createProfile, getCurrentProfile, getProfileById } from '../../actions/profileActions';
import isEmpty from '../../validation/is-empty';
import { Link } from 'react-router-dom';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      name: '',
      bio: '',
      DOB: '',
      img: '',
      twitter: '',
      facebook: '',
      youtube: '',
      instagram: '',
      errors: {}
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // componentDidMount() {
  //   this.props.getCurrentProfile();
  // }

  componentDidMount() {
    if(this.props.match.params.id) {
      this.props.getProfileById(this.props.match.params.id);
    }
  }
  uploadWidget = () => {
    window.cloudinary.openUploadWidget(
      { cloud_name: "nakrap", upload_preset: "x2rmt9j3", tags: ["xmas"] },
      (error, result) => {
        this.setState({ img: result[0].url });
        // console.log(result[0].url);
        console.log(this.state.img);
      }
    );
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors});
    }
  

    if(nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
      profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
      profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
      profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';

      // set component fields state
      this.setState({
        name: profile.name,
        bio: profile.bio,
        DOB: profile.DOB,
        img: profile.img,
        twitter: profile.twitter,
        facebook: profile.facebook,
        youtube: profile.youtube,
        instagram: profile.instagram,
        id: profile._id
      })
      
    }
  }

  onSubmit(e) {
    e.preventDefault(); 
    
    const profileData = {
      name: this.state.name,
      bio: this.state.bio,
      DOB: this.state.DOB,
      img: this.state.img,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      youtube: this.state.youtube,
      instagram: this.state.instagram,
      id: this.state.id
    }

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Facebook profile URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Youtube profile URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="Instagram profile URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      )
    }

    return (
      <div className="create-profile cp-wrapper">
        <div className="container content-container">
          <div className="row">
            <div className="col-md-8 m-auto">

              <h1 className="display-4 text-center">Edit Profile</h1>
              <p className="lead text-center">
                Add some information about your loved one.
              </p>
              <div className="upload">
                <button 
                  onClick={this.uploadWidget.bind(this)}
                  className="btn btn-outline-light upload-button">
                  <i className="fas fa-upload"></i>  Upload  an Image
                </button>
                    <span id='img-rec'> (Recommended image - 600px X 600px)</span>
              </div>
              {/* <small className="d-block pb-3">* = required fields</small> */}
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup 
                  placeholder="* Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="* First and Last name"
                />
                <TextFieldGroup 
                  placeholder="* Date of Birth"
                  name="DOB"
                  type="date"
                  value={this.state.DOB}
                  onChange={this.onChange}
                  error={errors.DOB}
                  info="* Date of Birth"
                />
                <TextAreaFieldGroup 
                  placeholder="Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Write some words about your loved one"
                />
                <div className="mb-3">
                  <button 
                  type="button"
                  onClick={() => {
                    this.setState(prevState => ({
                      displaySocialInputs: !prevState.displaySocialInputs
                    }))
                  }} className="btn btn-light">
                  Add Social Network Links
                  </button>
                  <span className="text-muted"> (Optional)</span>
                </div>
                {socialInputs}
                <small className="d-block pb-3">* = required fields</small>

                <input 
                  type="submit" 
                  value="Submit" 
                  className="btn btn-info btn-block mt-4" 
                />
              </form>
              <Link id='cancel-btn' className="btn btn-warning" to="/Dashboard" style={{color:this.state.color}}>
              Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile, getProfileById })(withRouter(CreateProfile));
