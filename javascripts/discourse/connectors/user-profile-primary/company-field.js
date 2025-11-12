import Component from "@glimmer/component";
import { service } from "@ember/service";

export default class CompanyField extends Component {
  @service currentUser;
  @service siteSettings;

  get shouldShowCompanyField() {
    const currentUser = this.currentUser;
    const allowedGroupName = this.siteSettings.custom_field_visibility_allowed_group_name;

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

    // Check if the user being viewed has a custom field value
    const userBeingViewed = this.args.outletArgs?.model;
    if (!userBeingViewed?.user_fields) {
      return false;
    }

    // Get the custom field ID from site settings
    const customFieldId = this.getCustomFieldId();
    if (!customFieldId) {
      return false;
    }

    const customFieldValue = userBeingViewed.user_fields[customFieldId];
    return !!customFieldValue;
  }

  get companyValue() {
    const userBeingViewed = this.args.outletArgs?.model;
    const customFieldId = this.getCustomFieldId();

    if (!customFieldId || !userBeingViewed?.user_fields) {
      return null;
    }

    return userBeingViewed.user_fields[customFieldId];
  }

  getCustomFieldId() {
    const customFieldName = this.siteSettings.custom_field_visibility_custom_field_name;

    // Find the custom field ID by looking through all user fields
    const userFields = this.args.outletArgs?.model?.user_fields;
    if (!userFields) {
      return null;
    }

    // The user_fields object has numeric keys (field IDs) as keys
    // We need to find which one corresponds to the configured custom field
    // This will be available in the site's user field definitions
    const site = this.args.outletArgs?.model?.site;
    if (site?.user_fields) {
      const customField = site.user_fields.find(
        (field) => field.name.toLowerCase() === customFieldName.toLowerCase()
      );
      return customField?.id;
    }

    return null;
  }
}
