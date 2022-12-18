# Python file used to generate output csv

import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# Goal is to remove empty lines and start graph at t=0 for ease of regresion
def clean_data():
    t = []
    ppi = []
    f = open("./raw.csv", "r")
    csvFile = csv.reader(f)
    count = 0
    # iterate over each line in the file
    for line in csvFile:
        # if the line does not have empty data
        if line[1] != "." and line[0] != "date":
            # append count to x-axis
            t.append(count)
            # append the data to the y-axis
            ppi.append(float(line[1]))
            # increment counter (t value)
            count += 1
        # else if line is empty, skip over associated t value 
        else:
            count += 1

    return t, ppi

def main():    
    x, y = clean_data()
    x = np.array(x)
    plt.figure(figsize=(10,6))
    plt.scatter(x, y)
    plt.xlabel("time since Jan 1961 (step in months)")
    plt.ylabel("Producer Price Index of Insulin")
    plt.title("Polynomial Regression of Producet Price index of Insulin")

    poly = PolynomialFeatures(degree=5, include_bias=True)
    poly_features = poly.fit_transform(x.reshape(-1, 1))
 
    poly_reg_model = LinearRegression()
    poly_reg_model.fit(poly_features, y)
    y_predicted = poly_reg_model.predict(poly_features)
    
    plt.plot(x, y_predicted, c='red')

    f = open('./output.csv', 'w')
    f.write("\"t\",\"ppi\"\n")
    for i in range(len(x)):
        row = str(x[i]) + "," + str(y_predicted[i]) + '\n'
        f.write(row)
    f.close()
    predict_x = np.array(list(range(666, 800)))
    predict_xform = poly.fit_transform(predict_x.reshape(-1,1))
    new_predict = poly_reg_model.predict(predict_xform)\

    f = open('./predict.csv', 'w')
    f.write("\"t\",\"ppi\"\n")
    for i in range(len(predict_x)):
        f.write(str(predict_x[i]) + "," + str(new_predict[i]) + '\n')
    f.close()

if __name__ == '__main__':
    main()