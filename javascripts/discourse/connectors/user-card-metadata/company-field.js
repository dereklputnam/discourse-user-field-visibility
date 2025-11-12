import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  api.modifyClass("component:user-card-contents", {
    pluginId: "custom-field-visibility",

    didInsertElement() {
      this._super(...arguments);
      this.checkCustomFieldVisibility();
    },

    checkCustomFieldVisibility() {
      const currentUser = this.currentUser;
      const allowedGroupName = this.siteSettings.custom_field_visibility_allowed_group_name;
      const customFieldName = this.siteSettings.custom_field_visibility_custom_field_name;

      if (!currentUser) {
        this.set("shouldShowCompanyField", false);
        return;
      }

      // Check if current user is in the allowed group
      const userGroups = currentUser.groups || [];
      const isInAllowedGroup = userGroups.some(
        (group) => group.name === allowedGroupName
      );

      if (isInAllowedGroup) {
        const userBeingViewed = this.user;

        // Find the custom field ID by name
        const customFieldId = this.getCustomFieldId(customFieldName);

        if (customFieldId) {
          const customFieldValue = userBeingViewed?.user_fields?.[customFieldId];

          if (customFieldValue) {
            this.set("shouldShowCompanyField", true);
            this.set("companyValue", customFieldValue);
          } else {
            this.set("shouldShowCompanyField", false);
          }
        } else {
          this.set("shouldShowCompanyField", false);
        }
      } else {
        this.set("shouldShowCompanyField", false);
      }
    },

    getCustomFieldId(customFieldName) {
      const site = this.site;
      if (site?.user_fields) {
        const customField = site.user_fields.find(
          (field) => field.name.toLowerCase() === customFieldName.toLowerCase()
        );
        return customField?.id;
      }
      return null;
    }
  });
});
