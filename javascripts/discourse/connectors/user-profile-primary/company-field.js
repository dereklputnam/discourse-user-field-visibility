import Component from "@glimmer/component";
import { service } from "@ember/service";

export default class CompanyField extends Component {
  @service currentUser;
  @service siteSettings;

  get shouldShowCompanyField() {
    const currentUser = this.currentUser;
    const allowedGroupName = this.siteSettings.company_field_visibility_allowed_group_name;

    if (!currentUser) {
      return false;
    }

    // Check if current user is in the allowed group
    const userGroups = currentUser.groups || [];
    const isInAllowedGroup = userGroups.some(
      (group) => group.name === allowedGroupName
    );

    if (!isInAllowedGroup) {
      return false;
    }

    // Check if the user being viewed has a company field value
    const userBeingViewed = this.args.outletArgs?.model;
    if (!userBeingViewed?.user_fields) {
      return false;
    }

    // Get the company field ID from site settings
    const companyFieldId = this.getCompanyFieldId();
    if (!companyFieldId) {
      return false;
    }

    const companyValue = userBeingViewed.user_fields[companyFieldId];
    return !!companyValue;
  }

  get companyValue() {
    const userBeingViewed = this.args.outletArgs?.model;
    const companyFieldId = this.getCompanyFieldId();

    if (!companyFieldId || !userBeingViewed?.user_fields) {
      return null;
    }

    return userBeingViewed.user_fields[companyFieldId];
  }

  getCompanyFieldId() {
    // Find the company field ID by looking through all user fields
    const userFields = this.args.outletArgs?.model?.user_fields;
    if (!userFields) {
      return null;
    }

    // The user_fields object has numeric keys (field IDs) as keys
    // We need to find which one corresponds to the "company" field
    // This will be available in the site's user field definitions
    const site = this.args.outletArgs?.model?.site;
    if (site?.user_fields) {
      const companyField = site.user_fields.find(
        (field) => field.name.toLowerCase() === "company"
      );
      return companyField?.id;
    }

    // Fallback: iterate through user_fields to find the company value
    // This assumes the field exists and has a value
    return Object.keys(userFields)[0]; // You may need to adjust this
  }
}
