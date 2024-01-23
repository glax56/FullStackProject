# -*- coding: utf-8 -*-
"""
Created on Sat Jul 15 09:02:11 2023

@author: smgre
"""

#%%imports and paths
import pandas as pd
from ast import literal_eval

path = 'C:/repositories/cs6400-2023-02-Team08/Support Code'

#%%Household
#converter retains leading 0s
household_df = pd.read_table(f'{path}/Demo Data/Household.tsv',converters={'postal_code': str})\
#splits the utility strings into lists
household_df.utilities = household_df.utilities.str.split(',')
#makes nulls SQL compatible
household_df = household_df.astype(object).where(pd.notnull(household_df), 'NULL')
#fixes household type 
household_df.household_type = household_df.household_type.str.capitalize()
#makes the utilites one per row
household_df_utilities = household_df.explode('utilities')
#capitilize each word
household_df_utilities.utilities = household_df_utilities.utilities.str.title()

#%%write sql household
with open(f'{path}/SQL/Household_demo_data.sql', 'w') as f:
    f.write('INSERT INTO Household(email, postalCode, household_type, square_footage, heating, cooling)\nVALUES')
    for i, (index, row)  in  enumerate(household_df.iterrows()):
        if i == len(household_df) - 1: #if last row use semicolon instead of comma
            f.write(f"('{row['email']}', '{row['postal_code']}', '{row['household_type']}', {row['footage']}, {row['heating_temp']}, {row['cooling_temp']});")
    
        else:
            f.write(f"('{row['email']}', '{row['postal_code']}', '{row['household_type']}', {row['footage']}, {row['heating_temp']}, {row['cooling_temp']}),\n")

#%%write sql utilites
utility_df = pd.read_csv(f'{path}/Demo Data/public_utility_mapping.csv')
utility_dict = pd.Series(utility_df.public_utility_id.values,index=utility_df.public_utility).to_dict()

with open(f'{path}/SQL/utility_linkage_demo_data.sql', 'w') as f:
    
    for i, (index, row)  in  enumerate(household_df_utilities.iterrows()):
        if row.utilities == 'Null':
            pass
        else:
            f.write('INSERT INTO publicutilitylinkage(householdID, public_utility_id)\n')
            f.write(f"SELECT householdID,{utility_dict[row.utilities]} FROM household\n")
            f.write(f"where email='{row['email']}';\n")
            
#%%Manufacturer
manufacturer_df = pd.read_table(f'{path}/Demo Data/Manufacturer.tsv')
with open(f'{path}/SQL/Manufacturer_demo_data.sql', 'w') as f:
    f.write('INSERT INTO manufacturer(manufacturer_name)\nVALUES')
    for i, (index, row)  in  enumerate(manufacturer_df.iterrows()):
        if i == len(manufacturer_df) - 1: #if last row use semicolon instead of comma
            f.write(f"('{row['manufacturer_name']}');")
    
        else:
            f.write(f"('{row['manufacturer_name']}'),\n")
           
#%%Appliance
appliance_df = pd.read_table(f'{path}/Demo Data/Appliance.tsv')
manufacturer_mapping_df = pd.read_csv(f'{path}/Demo Data/manufacturer_mapping.csv')
manufacturer_mapping_dict = pd.Series(manufacturer_mapping_df.manufacturerID.values,index=manufacturer_mapping_df.manufacturer_name).to_dict()
#makes nulls SQL compatible
appliance_df = appliance_df.astype(object).where(pd.notnull(appliance_df), 'NULL')
#capitilize each word
appliance_df.energy_source = appliance_df.energy_source.str.capitalize()
#fix appliance types
appliance_df.appliance_type = appliance_df.appliance_type.replace('air_handler', 'Air handler')
appliance_df.appliance_type = appliance_df.appliance_type.replace('water_heater', 'Water heater')
#splits the air_handler_types strings into lists
appliance_df.air_handler_types = appliance_df.air_handler_types.str.split(',')
#makes the air_handler_types one per row
appliance_aht_df = appliance_df.explode('air_handler_types')

with open(f'{path}/SQL/appliance_demo_data.sql', 'w') as f:
    
    for i, (index, row)  in  enumerate(appliance_df.iterrows()):
        #appliance table
        f.write('INSERT INTO appliance(householdID, applianceID, applianceType, manufacturerID, model_name, btu_rating)\n')
        if row['model'] == 'NULL':
            f.write(f"SELECT h.householdID,{row['appliance_number']},'{row['appliance_type']}',{manufacturer_mapping_dict[row.manufacturer_name]},NULL,{row['btu']} FROM household h\n")
        else:
            f.write(f"SELECT h.householdID,{row['appliance_number']},'{row['appliance_type']}',{manufacturer_mapping_dict[row.manufacturer_name]},'{row['model']}',{row['btu']} FROM household h\n")
        f.write(f"WHERE email='{row['household_email']}';\n")
        #water heatertable
        if row['appliance_type'] == 'Water heater':
            f.write('INSERT INTO waterheater(householdID, applianceID, energy_source, tank_size, temp_setting)\n')
            f.write(f"SELECT h.householdID,{row['appliance_number']},'{row['energy_source']}',{row['tank_size']},{row['temperature']} FROM household h\n")
            f.write(f"WHERE email='{row['household_email']}';\n")
            
        elif row['appliance_type'] == 'Air handler':
            f.write('INSERT INTO airhandler(householdID, applianceID, rpm)\n')
            f.write(f"SELECT h.householdID,{row['appliance_number']},{row['rpm']} FROM household h\n")
            f.write(f"WHERE email='{row['household_email']}';\n")
            
            if 'air_conditioner' in row['air_handler_types']:
                f.write('INSERT INTO airconditioner(householdID, applianceID, eer)\n')
                f.write(f"SELECT h.householdID,{row['appliance_number']},{row['eer']} FROM household h\n")
                f.write(f"WHERE email='{row['household_email']}';\n")
            
            if 'heater' in row['air_handler_types']:
                f.write('INSERT INTO heater(householdID, applianceID, source)\n')
                f.write(f"SELECT h.householdID,{row['appliance_number']},'{row['energy_source']}' FROM household h\n")
                f.write(f"WHERE email='{row['household_email']}';\n")
            
            
            if 'heatpump' in row['air_handler_types']:
                f.write('INSERT INTO heatpump(householdID, applianceID, seer, hspf)\n')
                f.write(f"SELECT h.householdID,{row['appliance_number']},{row['seer']},{row['hspf']} FROM household h\n")
                f.write(f"WHERE email='{row['household_email']}';\n")


#%%Power
generator_df = pd.read_csv(f'{path}/Demo Data/generator_type_mapping.csv')
generator_dict = pd.Series(generator_df.generatorTypeID.values,index=generator_df.generator_type).to_dict()

power_df = pd.read_table(f'{path}/Demo Data/Power.tsv')
#makes nulls SQL compatible
power_df = power_df.astype(object).where(pd.notnull(power_df), 'NULL')
#capitilize each word
power_df.energy_source = power_df.energy_source.str.capitalize()


with open(f'{path}/SQL/generator_demo_data.sql', 'w') as f:
    
    for i, (index, row)  in  enumerate(power_df.iterrows()):
        if row.energy_source == 'Null':
            pass
        else:
            f.write('INSERT INTO powergenerator(householdID, powerGeneratorID, generatorTypeID, monthly_kilowatt, battery_storage)\n')
            f.write(f"SELECT householdID,{row['power_number']},{generator_dict[row['energy_source']]},{row['kilowatt_hours']},{row['battery']} FROM household\n")
            f.write(f"where email='{row['household_email']}';\n")

