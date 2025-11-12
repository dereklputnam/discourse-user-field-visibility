import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  api.modifyClass("component:user-card-contents", {
    pluginId: "company-field-visibility",

    didInsertElement() {
      this._super(...arguments);
      this.checkCompanyFieldVisibility();
    },

    checkCompanyFieldVisibility() {
      const currentUser = this.currentUser;
      const allowedGroupName = this.siteSettings.company_field_visibility_allowed_group_name;

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
        const companyField = userBeingViewed?.user_fields?.[this.siteSettings.company_field_id];

        if (companyField) {
          this.set("shouldShowCompanyField", true);
          this.set("companyValue", companyField);
        } else {
          this.set("shouldShowCompanyField", false);
        }
      } else {
        this.set("shouldShowCompanyField", false);
      }
    }
  });
});
