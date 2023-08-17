cd ..
cd backend/kafka_2.13-3.5.1
bin/zookeeper-server-start.sh config/zookeeper.properties &
bin/kafka-server-start.sh config/server.properties
