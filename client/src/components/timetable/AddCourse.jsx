import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { clearCurrentCourse } from "../../actions/UpdateCurrentCourse";
import SearchTabs from "./SearchTabs";
import SectionTabs from "./SectionTab";
import ToggleButton from "../ToggleButton";

const AddCourse = (props) => {
  function getSections(type) {
    let course = props.currentCourse;
    let code = Object.keys(course)[0];
    let selectSections = (obj) =>
      Object.keys(obj)
        .filter((item) => item.charAt(0) === type)
        .reduce((res, key) => ((res[key] = obj[key]), res), {});
    return selectSections(props.currentCourse[code].sections);
  }

  return (
    <div>
      {!props.currentCourse ? (
        <div>
          <SearchTabs allCourses={props.allCourses} />
        </div>
      ) : (
        <div>
          <h3>{Object.keys(props.currentCourse)}</h3>
          <ToggleButton
            action={() => {
              props.clearCurrentCourse();
            }}
            title='Change Course'
          />
          <SectionTabs getSections={getSections} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentCourse: state.updateCC.currentCourse,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCurrentCourse: () => dispatch(clearCurrentCourse()),
  };
};

AddCourse.propTypes = {
  allCourses: PropTypes.object.isRequired,
  clearCurrentCourse: PropTypes.func.isRequired,
  currentCourse: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCourse);
