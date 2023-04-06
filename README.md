# intervals-wellness

Simple form for easier wellness input for [Intervals](https://intervals.icu/) platform

## How to run

### Angular CLI

Usual angular command:
```
ng serve
```

### Docker# intervals-wellness

Simple form for easier wellness input for [Intervals](https://intervals.icu/) platform

Docker image is available for local run.

## Supported fields

* Weight
* RHR
* HRV (RMSSD)
* HRV (SDNN)
* kCal Consumed
* Sp02
* Sleep Score
* Avg Sleeping HR
* Readiness
* Baevsky SI
* Blood Glucose
* Lactate
* Hydration (L)
* Body Fat
* Abdomen (cm)
* VO2 Max
* Comments

## TODO

* [x] get selected fields from Intervals
* [x] handle 403 errors
* [x] show success or error icons on sent
* [ ] show fields which not supported


Docker image is available. There is example of [docker-compose.yml](https://github.com/freekode/intervals-wellness/blob/main/docker-compose.yml)

Copy `docker-compose.yml` file to your directory. Then run:
```
docker-compose up -d
```



## TODO

* [x] get selected fields from Intervals
* [x] handle 403 errors
* [x] show success or error icons on sent
* [ ] show fields which not supported
