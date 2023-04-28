# 啟動後端程式
cd backend
node dask.js &
cd ..

#啟動車載系統
sleep 1
cd car_system
node post_ID.js
