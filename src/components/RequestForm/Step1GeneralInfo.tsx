import React, { memo, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import CountryCodeSelector from '@/components/Common/CountryCodeSelector';
import EmailValidator from '@/components/Common/EmailValidator';

interface Step1Props {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onCountrySelect: (country: any) => void;
  onEmailValidation: (isValid: boolean, error: string | null) => void;
}

const Step1GeneralInfo: React.FC<Step1Props> = memo(({
  formData,
  errors,
  onInputChange,
  onCountrySelect,
  onEmailValidation
}) => {
  const { t } = useTranslation('common');

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
  }, [onInputChange]);

  return (
    <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
      <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
      
      <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
        <div className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15">
          <h2 className="mb-10 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
            {t('visa_application.steps.general_info')}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); }}>
            {/* Email Field */}
            <div className="mb-7.5">
              <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                {t('visa_application.general.email')} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="example@email.com"
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                required
              />
              <EmailValidator 
                email={formData.email} 
                onValidationChange={onEmailValidation}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="mb-7.5">
              <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                {t('visa_application.general.phone')} *
              </label>
              <div className="flex gap-2">
                <CountryCodeSelector
                  selectedCountry={formData.countryCode}
                  onCountrySelect={onCountrySelect}
                  error={errors.phone}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  placeholder="123456789"
                  className="flex-1 border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                  required
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Travel Purpose */}
            <div className="mb-7.5">
              <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                {t('visa_application.general.travel_purpose')} *
              </label>
              <select
                name="travelPurpose"
                value={formData.travelPurpose}
                onChange={onInputChange}
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
              >
                <option value="tourism">Tourism</option>
                <option value="business">Business</option>
                <option value="family">Family Visit</option>
                <option value="education">Education</option>
                <option value="medical">Medical</option>
              </select>
            </div>

            {/* Arrival Date */}
            <div className="mb-7.5">
              <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                {t('visa_application.general.arrival_date')} *
              </label>
              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={onInputChange}
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                required
              />
              {errors.arrivalDate && (
                <p className="mt-1 text-sm text-red-500">{errors.arrivalDate}</p>
              )}
            </div>

            {/* Number of Entries */}
            <div className="mb-7.5">
              <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                {t('visa_application.general.number_of_entries')} *
              </label>
              <select
                name="numberOfEntries"
                value={formData.numberOfEntries}
                onChange={onInputChange}
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
              >
                <option value="single">Single Entry</option>
                <option value="double">Double Entry</option>
                <option value="multiple">Multiple Entry</option>
              </select>
            </div>

            {/* Address in Mauritania */}
            <div className="mb-7.5">
              <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                {t('visa_application.general.address_in_mauritania')} *
              </label>
              <input
                type="text"
                name="addressInMauritania"
                value={formData.addressInMauritania}
                onChange={onInputChange}
                placeholder="e.g., Nouakchott, Mauritania"
                maxLength={50}
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                required
              />
              {errors.addressInMauritania && (
                <p className="mt-1 text-sm text-red-500">{errors.addressInMauritania}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.addressInMauritania.length}/50 {t('validation.address_too_long')}
              </p>
            </div>

            {/* Purpose Description */}
            <div className="mb-12.5">
              <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                {t('visa_application.general.purpose_description')} *
              </label>
              <textarea
                name="purposeDescription"
                value={formData.purposeDescription}
                onChange={handleDescriptionChange}
                placeholder="Describe your travel purpose in detail..."
                rows={4}
                minLength={30}
                maxLength={3000}
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                required
              />
              {errors.purposeDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.purposeDescription}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.purposeDescription.length}/3000 {t('validation.description_max_length')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

Step1GeneralInfo.displayName = 'Step1GeneralInfo';

export default Step1GeneralInfo;
