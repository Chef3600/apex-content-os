#!/usr/bin/env bash
# Fill in a number, delete the lines you could not verify, then:  bash outreach/record-contacts.sh
# VERIFIED is refused without --source. That is deliberate.
set -e
cd "$(dirname "$0")/.."

# A  Slater's 50/50 Las Vegas  (restaurant-group)  - Andy Kao, Cindy Sun
#   lookup: https://www.google.com/maps/search/Slater's%2050%2F50%20Las%20Vegas%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a073 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Saucy  (packaged-food)  - Chef Amy
#   lookup: https://www.google.com/maps/search/Saucy%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p048 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Alex Prime at El Cortez  (restaurant)  - David Robins, Joe Swan
#   lookup: https://www.google.com/maps/search/Alex%20Prime%20at%20El%20Cortez%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a114 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Cantina Contramar  (restaurant)  - Gabriela Camara
#   lookup: https://www.google.com/maps/search/Cantina%20Contramar%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a120 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Maroon by Kwame Onwuachi  (restaurant)  - Kwame Onwuachi
#   lookup: https://www.google.com/maps/search/Maroon%20by%20Kwame%20Onwuachi%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a121 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Sartiano's Italian Steakhouse  (restaurant)  - Scott Sartiano
#   lookup: https://www.google.com/maps/search/Sartiano's%20Italian%20Steakhouse%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a122 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Esther's Kitchen  (restaurant)  - James Trees, chef-owner
#   lookup: https://www.google.com/maps/search/Esther's%20Kitchen%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p001 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Al Solito Posto  (restaurant)  - James Trees, chef-owner
#   lookup: https://www.google.com/maps/search/Al%20Solito%20Posto%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p002 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Milpa Mexican Cafe  (restaurant)  - DJ Flores, chef
#   lookup: https://www.google.com/maps/search/Milpa%20Mexican%20Cafe%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p003 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# A  Johnny C's Diner  (restaurant)  - Johnny Church, chef-owner
#   lookup: https://www.google.com/maps/search/Johnny%20C's%20Diner%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p004 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Center for Aesthetic Medicine  (medspa)  - Heather Rohrer
#   lookup: https://www.google.com/maps/search/Center%20for%20Aesthetic%20Medicine%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a067 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Skinfuzion  (medspa)  - Kim Hutchinson, owner
#   lookup: https://www.google.com/maps/search/Skinfuzion%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p030 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Advanced Aesthetics  (medspa)  - Dr. Tracy Hankins, Dr. Samuel Sohn
#   lookup: https://www.google.com/maps/search/Advanced%20Aesthetics%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p035 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Chic la Vie Medical Spa  (medspa)
#   lookup: https://www.google.com/maps/search/Chic%20la%20Vie%20Medical%20Spa%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a069 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  LuxeFactor Aesthetics  (medspa)
#   lookup: https://www.google.com/maps/search/LuxeFactor%20Aesthetics%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a070 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  DermaBella Medical Spa  (beauty)  - Dr. Andrea Dempsey, founder
#   lookup: https://www.google.com/maps/search/DermaBella%20Medical%20Spa%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p031 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Vegas Dental Experts  (dental)  - Dr. Harvey Chin
#   lookup: https://www.google.com/maps/search/Vegas%20Dental%20Experts%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a058 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Infinity Dental  (dental)  - Dr. Douglas Sanchez
#   lookup: https://www.google.com/maps/search/Infinity%20Dental%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a059 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Ah Spa by Ageless Humans - Westin Lake Las Vegas  (medspa)
#   lookup: https://www.google.com/maps/search/Ah%20Spa%20by%20Ageless%20Humans%20-%20Westin%20Lake%20Las%20Vegas%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set a119 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"

# B  Estetica Wellness Medical Spa  (beauty)
#   lookup: https://www.google.com/maps/search/Estetica%20Wellness%20Medical%20Spa%20Las%20Vegas%2C%20NV
# node tools/enrich.mjs set p032 phone "PHONE_HERE" --status=VERIFIED --source="SOURCE_URL_HERE"
