# Python file used to generate output2 csv
import csv
import numpy as np
import pandas as pd
import math
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

initial_date = ""

# Goal is to remove empty lines and start graph at t=0 for ease of regresion
def clean_data():
    global initial_date
    t = []
    ppi = []
    f = open("./test.csv", "r")
    csvFile = csv.reader(f)
    count = 0
    # iterate over each line in the file
    for line in csvFile:
        # if the line does not have empty data
        if line[1] != "." and line[0] != "DATE":
            # append count to x-axis
            if count == 1:
                initial_date += line[0]
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
    # Acquire the cleaned data  
    x, y = clean_data()
    # create array
    x = np.array(x)
    # initialize plot with original data
    plt.figure(figsize=(10,6))
    plt.scatter(x, y)
    print(initial_date)
    plt.xlabel("time since " + initial_date + " (step in months)")
    plt.ylabel("Producer Price Index of Insulin")
    plt.title("Polynomial Regression of Producet Price index of Insulin")

    # create polynomial regression of degree 6
    poly = PolynomialFeatures(degree=3, include_bias=True)
    # poly features for fitting coefficients
    poly_features = poly.fit_transform(x.reshape(-1, 1))
    
    # create regression
    poly_reg_model = LinearRegression()
    # fit data to polynomial regression
    poly_reg_model.fit(poly_features, y)
    # get the regression
    y_predicted = poly_reg_model.predict(poly_features)
    # add regression to plot
    plt.plot(x, y_predicted, c='red')

    # write the new data points for exporting
    f = open('./output2.csv', 'w')
    f.write("\"t\",\"ppi\"\n")
    # for each data point
    for i in range(len(x)):
        # write to new row, "x,y"
        row = str(x[i]) + "," + str(y_predicted[i]) + '\n'
        f.write(row)
    f.close()

    # predict new data points 744-780
    predict_x = np.array(list(range(len(x), len(x)+100)))
    predict_xform = poly.fit_transform(predict_x.reshape(-1,1))
    new_predict = poly_reg_model.predict(predict_xform)

    # write new predictions to new file
    f = open('./predict.csv', 'w')
    f.write("\"t\",\"ppi\"\n")
    for i in range(len(predict_x)):
        # write to new row, "x,y"
        f.write(str(predict_x[i]) + "," + str(new_predict[i]) + '\n')
    f.close()

    # print constants, and RMSE
    print("Constants: ", poly_reg_model.coef_)
    print("Intercept: ", poly_reg_model.intercept_)
    print("RMSE: ", math.sqrt(mean_squared_error(y, y_predicted)))
    plt.show()

if __name__ == '__main__':
    main()