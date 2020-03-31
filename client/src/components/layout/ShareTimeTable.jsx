
import React, { Fragment, useState, Link } from "react";
import Creatable from "react-select";
import { components } from "react-select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { useGetData } from "use-axios-react";
import "../../styles/HelForm.css";
import { editTT } from "../../actions/UpdateTimeTable";

const branches = [
  { value: "BIO", label: "Biological Sciences" },
  { value: "CHE", label: "Chemical Engineering" },
  { value: "CHEM", label: "Chemistry" },
  { value: "CE", label: "Civil Engineering" },
  { value: "CS", label: "Computer Science" },
  { value: "ECO", label: "Economics & Finance" },
  { value: "ECE", label: "Electrical & Communication Engineering" },
  { value: "EEE", label: "Electrical & Electronics Engineering" },
  { value: "INSTR", label: "Electronics & Instrumentation Engineering" },
  { value: "MANU", label: "Manufacturing Engineering" },
  { value: "MATH", label: "Mathematics" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "PHA", label: "Pharmacy" },
  { value: "PHY", label: "Physics" }
];


const ShareTimeTable = () => {

  const [formData, setFormData] = useState({
    branch: [],
    year: "",
    TTs: [],
  });

  const { branch, year, TTs } = formData;

  const submitToMongo = async (branch, year) => {
    //const studentData = JSON.stringify({ branch, year });

    let TTData = [];
    try {
      let br = [];
      branch.forEach(item => { br.push(item["value"]); });
      let res = await axios
        .get("/api/share/sharett", {
          params: {
            'branch': br,
            'year': year
          }
        })
        .then((response) => {
          console.log("Here");
          if (response.status !== 200) {
            
            throw new Error("Could not submit query.");
          }
          else {

            TTData = JSON.parse(JSON.stringify(response["data"]));
            console.log(TTData);
            setFormData({...formData,TTs: TTData });
          }
        });
    }
    catch (err) {
      console.log(err);
      setFormData({...formData});
    }

  }

  const handleBranchChange = newBranch => {
    console.log(newBranch);
    setFormData({
      ...formData,
      branch: newBranch
    });
    //console.log(formData.branch,branch);
  };
  const handleYearChange = e => {
    if (e.target.checked) {
      setFormData({
        ...formData,
        year: e.target.value
      });
    }
  };


  const onSubmit = async e => {
    
    e.preventDefault();
    console.log(year);
    if (!branch || branch.length === 0) {
      window.alert("Please enter your branch");
    } else if (year === "" || year === NaN) {
      window.alert("Please enter your year");
    } else {


      submitToMongo(branch, year);

    }
    
   // setFormData({...formData, branch: [],year: ""});
    
  };







  /**
   * Check to redirect to dashboard once user submits form
   * Cannot use api route to get submitted --> race condition, condition executes before state is updated
   * (new user conditions) || (old user conditions)
   */
  /*
   if ((!submitted && user && user.submittedForm) || submitted) {
    return <Redirect to='/dashboard'></Redirect>;
  }
  */

  const Menu = props => {
    const optionSelectedLength = props.getValue().length || 0;
    return (
      <components.Menu {...props}>
        {optionSelectedLength < 2 ? (
          props.children
        ) : (
            <div className='wide-menu-row'>
              You cannot select more than 2 branches
            </div>
          )}
      </components.Menu>
    );
  };
  const isValidNewOption = (inputValue, selectValue) =>
    inputValue.length > 0 && selectValue.length < 5;

  const [userInfo, loading] = useGetData("/api/share/shareTT/");
  //const loading = true;
  let str =
    [<Fragment>
      <p className='title'>
        Hi!
        We would like to know a few things before you continue
        Please Enter your Branch, year and select your Humanities Courses of the previous semester below:
      </p>
      <form className='form-whole' onSubmit={onSubmit}>
        <div className='container-helform'>
          <Creatable
            components={{ Menu }}
            onChange={handleBranchChange}
            value={branch}
            isMulti
            isValidNewOption={isValidNewOption}
            options={branch && branch.length >= 2 ? branch : branches}
            className='left-width branch-inp'
            placeholder='Select branch (select 2 branches for dual degree)'
            theme={theme => ({
              ...theme,
              borderRadius: 2,
              colors: {
                ...theme.colors,
                primary25: "#fecb6e",
                neutral0: "#f9e3b4"
              }
            })}
          />
          <p className='label-mod branch-inp'>Select year: </p>
          <FormControl component='fieldset' className='radio-grp'>
            <RadioGroup
              row
              aria-label='position'
              name='position'
              defaultValue='End'
              className='radio-grp'
            >
              <FormControlLabel
                value='1'
                control={<Radio color='primary' />}
                label='First'
                className='text-black'
                onChange={handleYearChange}
              />
              <FormControlLabel
                value='2'
                control={<Radio color='primary' />}
                label='Second'
                className='text-black'
                onChange={handleYearChange}
              />
              <FormControlLabel
                value='3'
                control={<Radio color='primary' />}
                label='Third'
                className='text-black'
                onChange={handleYearChange}
              />
              <FormControlLabel
                value='4'
                control={<Radio color='primary' />}
                label='Fourth'
                className='text-black'
                onChange={handleYearChange}
              />
              <FormControlLabel
                value='5'
                control={<Radio color='primary' />}
                label='Fifth'
                className='text-black'
                onChange={handleYearChange}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className='form-group'>
          <input
            type='submit'
            className='btn btn-primary btn-hf btn-big'
            value='Submit'
          />
        </div>
      </form>
    </Fragment>];

  if (!loading && formData["TTs"].length !== 0) {
    console.log(formData['TTs']);
    let Disp = [];
    (formData["TTs"]).map(item => {
      console.log(item.name);
      Disp.push(
        <div>
          <p> {item.name}</p>
          <Link
            to='/create'
            onClick={() => {
              editTT(item);
            }}
          >
            <button>
              View/Edit
              </button>
          </Link>
        </div>
      );
    });
    for (let Dis of Disp) {
      str.push(Dis);
    }
  }
  else {
    str.push(<h3>No TTs</h3>);
  }
  console.log(<>{str}</>);

  return <>{str}</>;

};

const mapDispatchToProps = dispatch => {
  return {
    editTT: tt => dispatch(editTT(tt))
  };
};

ShareTimeTable.propTypes = {
  editTT: PropTypes.func.isRequired
};




export default connect(null, mapDispatchToProps)(ShareTimeTable);
