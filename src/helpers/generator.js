/**
 * Generate a random id string
 *
 * @ return   string   random generated
 */
export function guidGenerator() {
    const gen = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (gen()+gen()+"-"+gen()+"-"+gen()+"-"+gen()+"-"+gen()+gen());
}
