import {Request, Response} from 'express';
import convertHourToMinutes from "../Utils/convertHourToMinutes";
import db from '../database/connection';


interface scheduleItem{
    week_day:number;
    from: string;
    to: string;
}


export default class ClassesController {

    async index(request:Request, response:Response){
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;
    
        if(!filters.week_day||!filters.subject|| !filters.time){
            return response.status(400).json({
            error:' missing filters' 
                
            })
        }
        const timeInMinutes = convertHourToMinutes(time );

        console.log(timeInMinutes);


        const classes = await db('classes')
        .whereExists(function(){
            this.select("class_schedule.*")
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id`=`classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
            .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject', '=', subject )
        .join('users', 'classes.user_id', '=', 'users.id' )
        .select(['classes.*', 'users.*']);
        
        return response.json(classes);


    }

    
    async create (request: Request, response:Response) { 
   
    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

    const trx = await db.transaction();
    
    try{


   const insertUserIds =  await trx('users').insert({
    name,
    avatar,
    whatsapp,
    bio,
});

const user_id = insertUserIds[0];

const insertClassesIds = await trx('classes').insert({
    subject,
    cost,
    user_id,
});

 const class_id = insertClassesIds[0];

const classSchedule = schedule.map((scheduleItem: scheduleItem)=>{
    return{
        class_id, 
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),

    };
})

await trx('class_schedule').insert(classSchedule);

await trx.commit();


return response.status(200).send();
    
}catch (err){
    await trx.rollback();

    return response.status(400).json({
        error: 'alogo deu errado na criação da classe'
        
    })
}
    
}};